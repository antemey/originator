module.exports = {
  forbidden: [
    { name: 'no-cycles', severity: 'error', from: {}, to: { circular: true } },
    {
      name: 'no-unresolved',
      severity: 'error',
      from: {},
      to: { couldNotResolve: true },
    },
    {
      name: 'engine-is-independent',
      severity: 'error',
      from: { path: '^src/engine/' },
      to: { path: '^(harness|fixtures|tests|research|woo|target)/' },
    },
    {
      name: 'engine-no-io',
      severity: 'error',
      from: { path: '^src/engine/' },
      to: { dependencyTypes: ['core', 'npm', 'npm-dev'] },
    },
    {
      name: 'harness-no-engine-implementation',
      severity: 'error',
      from: { path: '^harness/', pathNot: '^harness/run-heldout\\.ts$' },
      to: { path: '^src/engine/', pathNot: '^src/engine/contract\\.ts$' },
    },
    {
      name: 'harness-no-target-adapter',
      severity: 'error',
      from: { path: '^harness/' },
      to: { path: '^woo/' },
    },
    {
      name: 'contract-no-harness',
      severity: 'error',
      from: { path: '^src/engine/contract\\.ts$' },
      to: { path: '^harness/' },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.json' },
    enhancedResolveOptions: { extensions: ['.ts', '.js', '.json'] },
  },
};
