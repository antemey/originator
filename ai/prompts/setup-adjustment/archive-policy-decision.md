# Archival policy decision — 2026-09-18

Operator intervention following phase A. Original instruction is preserved below in French. This record changes the archival method; it is not a new preparation mission or commit authorization.

## Original instruction

Une remarque pour les commits (on ne fera qu'un push final distant): 
L’unité d’archivage doit être la mission ou la décision significative, pas le commit.

Je conserverais les briefs effectivement exécutés pour la préparation, l’implémentation et la vérification, ainsi que les interventions qui changent réellement le périmètre, une hypothèse métier, le contrat, les références ou la méthode de validation. Une instruction à l’origine d’une correction importante après un échec mérite également d’être gardée — avec le résultat qui permet de comprendre son intérêt.

En revanche, pas besoin d’archiver séparément « continue », les autorisations de commandes, les relances identiques, les corrections de présentation ou chaque échange de débogage. Un checkpoint sans nouvelle instruction significative n’a donc aucun nouveau prompt à ajouter. Un même brief peut servir à plusieurs checkpoints sans être recopié à chaque fois.

La sélection ne doit pas consister à ne garder que les réussites : un essai infructueux qui a changé la démarche peut être plus instructif qu’une exécution sans incident. Mais cela ne justifie pas la conservation intégrale des conversations.

Mon arbitrage concret : oui, versionner et inclure dans la livraison le setup initial et ce correctif ciblé, comme annexes historiques identifiées. Pour la suite, conserver seulement les missions exécutées et les ajustements qui expliquent une décision ou une preuve importante. Cela maintient la traçabilité sans transformer tes checkpoints en obligations documentaires supplémentaires.

Et un renommage: setup-adjustment/ serait plus explicite que alignment/, fais le stp, et màj des liens éventuels

## Applied result

Renamed the phase-A archive directory to `setup-adjustment/` without altering its four original files. Updated repository references. The [constitution](../../constitution.md#archival-policy) now defines archival by executed mission or significant decision, preserves informative failures and excludes routine exchanges and per-checkpoint duplication. AGENTS, README, delivery instructions and the current handoff reflect that rule. Initial setup and this targeted adjustment remain historical annexes for versioning and final delivery. No commit or push was performed.
