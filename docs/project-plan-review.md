# OpenClaw Work Plan

This document focuses on what needs to be done in the `openclaw` project based on a repo review.

## What Needs To Be Done

## 1. CI and Quality Gates

### Re-enable dead-code reporting

What to do:

- Turn the disabled dead-code job back on in `.github/workflows/ci.yml`
- Run `knip`, `ts-prune`, and `ts-unused-exports` in CI again
- Store results as artifacts for review
- Triage results into: real dead code, false positives, intentional exports

Why:

- The repo is large enough that dead code will accumulate quickly
- Report-only visibility is missing today because the lane is disabled

### Add the TypeScript file-size guard to CI

What to do:

- Add `pnpm check:loc` to CI
- Start as report-only if needed
- Identify the largest TypeScript files above the 500-line policy
- Create follow-up tasks to split those files

Why:

- The file-size guard exists, but it is not enforced in the main `check` script
- Large files are likely to increase complexity and reduce review quality

### Add flaky-test and timing visibility

What to do:

- Capture test duration per suite or per directory
- Track unstable test failures over time
- Mark flaky tests explicitly
- Separate slow, stable tests from unstable or live-environment tests

Why:

- CI already shows scaling pressure through reduced workers, high heap usage, and Windows sharding
- The team needs to know which areas are expensive and unstable

### Normalize coverage expectations

What to do:

- Define expected coverage policy for TypeScript, macOS, Android, and iOS
- Document which suites count toward coverage and which do not
- Add missing coverage checks where needed
- Remove unclear or inconsistent coverage behavior across platforms

Why:

- Coverage exists in parts of the repo, but the policy is uneven
- iOS coverage exists in workflow logic but the job is disabled

### Restore at least minimal iOS CI coverage

What to do:

- Re-enable the iOS job in `.github/workflows/ci.yml`, or replace it with a lighter lane
- If simulator tests are too expensive, at minimum run project generation and build validation
- Add a clear reason and follow-up plan if full iOS test coverage remains disabled

Why:

- iOS is a supported surface but currently has no active CI lane
- This creates regression risk for an advertised platform

## 2. Codebase Structure and Refactoring

### Identify and split oversized core files

What to do:

- Find the largest and most frequently changed files in `src/`
- Prioritize gateway, routing, onboarding, compaction, and agent runtime areas
- Break large files into smaller modules with clearer responsibilities
- Add tests around extraction boundaries before refactoring risky code

Why:

- The core TypeScript surface is large
- Large central files tend to become bottlenecks for maintenance and review

### Reduce coupling between core and long-tail integrations

What to do:

- Review how core runtime logic depends on channels and extensions
- Move integration-specific logic out of shared core paths where possible
- Keep core interfaces stable and move channel-specific behavior behind adapters
- Reduce cases where adding one integration increases system-wide maintenance cost

Why:

- The repo supports many channels and extensions
- Coupling increases regression risk and makes refactors slower

### Resolve or schedule known follow-up comments in critical code

What to do:

- Review TODOs already called out in important runtime areas such as compaction
- Decide whether each one should be implemented, deferred with an issue, or removed
- Link code comments to tracked work where possible

Why:

- Existing TODOs in core runtime code are indicators of unfinished design decisions

## 3. Ownership and Maintenance Model

### Define ownership across major repo areas

What to do:

- Assign maintainers or ownership groups for `src/`, `extensions/`, `apps/`, `ui/`, `docs/`, and `skills/`
- Add `CODEOWNERS` coverage where useful
- Clarify who is responsible for approving changes in high-risk areas

Why:

- The repo is too broad to manage well without visible ownership
- This reduces review ambiguity and bus-factor risk

### Create a support-status matrix for channels and extensions

What to do:

- List every channel and extension
- Mark each as core supported, maintained, experimental, or community supported
- Include test status, docs status, security review status, and last significant validation date

Why:

- The current surface area is large enough that support level needs to be explicit
- This helps prioritize maintenance and user expectations

### Define a deprecation policy

What to do:

- Decide how low-usage or weakly maintained integrations are retired
- Define criteria for deprecation, migration messaging, and removal timing
- Apply the policy to channels or extensions that no longer justify full support

Why:

- Without a deprecation path, maintenance scope only grows

## 4. Documentation and Internal Resources

### Create an architecture map

What to do:

- Document the major system areas: gateway, agent runtime, channel routing, plugin SDK, apps, UI, skills, and release surfaces
- Show how data and control flow through the system
- Keep it short enough to stay maintainable

Why:

- The project is too broad for new contributors to infer structure quickly

### Create a test strategy document

What to do:

- Explain which tests are unit, integration, end-to-end, live, platform-specific, or installer-related
- Document where each suite runs
- Define which failures block merges and which are informational

Why:

- The test surface is large and likely expensive to understand without a guide

### Create a release runbook

What to do:

- Document all version bump locations
- Document validation steps for CLI, Docker, Android, macOS, iOS, and docs
- Define release verification and rollback steps

Why:

- The project has multiple release targets and packaging paths
- Drift between release surfaces is a realistic risk

### Create a security review checklist for new integrations

What to do:

- Define required checks for new channels, plugins, tools, and skills
- Include auth handling, untrusted input handling, webhook validation, permission model, and data exposure review

Why:

- The repo touches messaging platforms, browsers, devices, and automation systems
- New integrations should not rely on ad hoc review quality

## 5. Tooling That Should Be Added

### Dependency and boundary visibility

What to do:

- Add tooling to visualize imports and dependencies between core packages and extensions
- Detect invalid cross-boundary imports
- Use it to guide refactors and ownership decisions

Why:

- Monorepo scale makes architecture drift hard to see without tooling

### Generated manifests for supported surfaces

What to do:

- Generate a single source of truth for channels, extensions, and skills
- Use that source for docs, onboarding, settings, and support-status pages

Why:

- Manual duplication across docs and product surfaces will drift over time

### Benchmark suite for core performance paths

What to do:

- Add small repeatable benchmarks for startup, gateway response, and message handling
- Track trends over time in CI or nightly runs

Why:

- Performance regressions are hard to notice in a project with this many moving parts

## 6. Risks That Need Active Management

### Platform sprawl

Needs action:

- Reduce unsupported or weakly maintained surfaces
- Make support level explicit
- Stop treating all integrations as equally mature if they are not

### CI scaling pressure

Needs action:

- Identify slow suites
- Reduce unnecessary test cost
- Split heavy tests from default validation paths where appropriate

### Security drift

Needs action:

- Apply consistent review standards to channels, plugins, and tools
- Keep authentication, permission, and untrusted-input handling under active review

### Documentation drift

Needs action:

- Tie docs updates to product or integration changes
- Keep onboarding and troubleshooting aligned with what is actually supported

### Release drift

Needs action:

- Validate all shipped surfaces from one runbook
- Avoid partial release quality where one surface is current and others are stale

## 7. Priority Order

These should be done first:

1. Re-enable dead-code reporting
2. Add `check:loc` to CI
3. Restore minimal iOS CI coverage
4. Add flaky-test and timing visibility
5. Identify and split oversized core TypeScript files
6. Define ownership across major repo areas
7. Create the support-status matrix for channels and extensions
8. Create the release runbook
9. Create the security checklist for new integrations
10. Define deprecation policy for low-value or weakly maintained surfaces

## 8. Expected Outcome

If the items above are completed, the project should gain:

- Better visibility into real code health
- Lower maintenance entropy
- Clearer ownership
- More realistic support boundaries
- Lower platform regression risk
- Better release reliability
- Stronger security consistency across integrations
