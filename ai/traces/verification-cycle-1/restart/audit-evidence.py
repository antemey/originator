"""Offline source-to-fixture audit, independent of adapter and engine code."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
CASES = [
    ('target-transitions', 'phase-b-target-sequence.json', [1, 2, 3, 4, 5, 6, 8, 9, 10, 11], {5: 7}),
    ('target-mixed-replay', 'phase-b-target-replay.json', [2, 3, 4], {}),
    ('lab-mirror-mixed', 'phase-b-lab-mirror-cookie-session.json', [3, 5, 7], {}),
    ('lab-two-percent-nonsequential', 'phase-b-lab-interaction-measured.json', [3, 5, 7, 9, 11], {}),
]
LINE = ['line_subtotal', 'line_subtotal_tax', 'line_total', 'line_total_tax']
TOTAL = ['total_items', 'total_items_tax', 'total_discount', 'total_discount_tax']
COUPON = ['total_discount', 'total_discount_tax']


def money(value):
    assert isinstance(value, str) and value.isdigit(), value
    result = int(value)
    assert result <= 9007199254740991
    return result


def fields(obj, keys):
    return {key: money(obj[key]) for key in keys}


def projection(body, products):
    lines = []
    for item in body['items']:
        product = products[item['id']]
        line = {'ref': product['ref'], 'qty': item['quantity'], **fields(item['totals'], LINE)}
        if 'variant' in product:
            line['variant'] = product['variant']
        lines.append(line)
        assert item['prices']['raw_prices']['precision'] == product['price_precision']
        assert money(item['prices']['raw_prices']['price']) == product['unit_price']
    assert not body['fees']
    return {
        'lines': lines,
        'coupons': [{'code': c['code'], **fields(c['totals'], COUPON)} for c in body['coupons']],
        'totals': fields(body['totals'], TOTAL),
    }


def differences(expected, actual, path='$'):
    result = []
    if isinstance(expected, dict) and isinstance(actual, dict):
        for key in sorted(expected.keys() | actual.keys()):
            if key not in expected or key not in actual:
                result.append({'path': path + '.' + key, 'expected': expected.get(key, '<missing>'), 'actual': actual.get(key, '<missing>')})
            else:
                result.extend(differences(expected[key], actual[key], path + '.' + key))
    elif isinstance(expected, list) and isinstance(actual, list):
        for index in range(max(len(expected), len(actual))):
            if index >= len(expected) or index >= len(actual):
                result.append({'path': f'{path}[{index}]', 'expected': expected[index:] or '<missing>', 'actual': actual[index:] or '<missing>'})
            else:
                result.extend(differences(expected[index], actual[index], f'{path}[{index}]'))
    elif expected != actual:
        result.append({'path': path, 'expected': expected, 'actual': actual})
    return result


report = []
for fixture_name, source_name, action_records, overrides in CASES:
    fixture = json.loads((ROOT / 'fixtures/discovery' / (fixture_name + '.json')).read_text())
    source_path = ROOT / 'ai/traces/discovery' / source_name
    source = json.loads(source_path.read_text())
    digest = hashlib.sha256(source_path.read_bytes()).hexdigest()
    assert digest == fixture['source']['capture_hash']
    assert source['provenance'] == fixture['provenance']
    seed = json.loads((ROOT / fixture['seed_file']).read_text())
    products = {p['settings']['native_id']: p for p in seed['products']}
    checks = []
    for index, record_index in enumerate(action_records):
        record = source['records'][record_index]
        decision = {'action_index': index, 'accepted': 200 <= record['status'] < 300}
        if not decision['accepted']:
            decision.update({key: record['body'][key] for key in ['code', 'message']})
        checks.append({'kind': 'decision', 'action_index': index, 'source_label': record['label'], 'differences': differences(fixture['expected']['decisions'][index], decision)})
    for checkpoint in fixture['checkpoints']:
        index = checkpoint['after_action']
        record = source['records'][overrides.get(index, action_records[index])]
        actual = projection(record['body'], products)
        checks.append({'kind': 'checkpoint', 'action_index': index, 'source_label': record['label'], 'differences': differences(checkpoint['expected'], actual)})
        if source['provenance'] == 'lab':
            persisted = source['records'][action_records[index] + 1]
            assert persisted['label'] == record['label'] + '-persisted'
            checks.append({'kind': 'persisted GET', 'action_index': index, 'source_label': persisted['label'], 'differences': differences(checkpoint['expected'], projection(persisted['body'], products))})
    final = projection(source['records'][action_records[-1]]['body'], products)
    checks.append({'kind': 'final', 'differences': differences({k: v for k, v in fixture['expected'].items() if k != 'decisions'}, final)})
    report.append({'fixture': fixture_name, 'source': source_name, 'sha256': digest, 'seed_file': fixture['seed_file'], 'checks': checks})
output = Path(__file__).with_name('evidence-audit.json')
output.write_text(json.dumps(report, indent=2, ensure_ascii=False) + '\n')
failures = [check for case in report for check in case['checks'] if check['differences']]
print(json.dumps({'fixtures': len(report), 'checks': sum(len(case['checks']) for case in report), 'failures': failures}, ensure_ascii=False))
raise SystemExit(bool(failures))
