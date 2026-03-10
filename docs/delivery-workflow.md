# Delivery Workflow: Bug Fixes and Feature Development

Use this as the default process unless a task explicitly overrides it.

## 1) Intake and Scope
- Confirm the request target and acceptance criteria (issue body, user request, or both).
- Identify in-scope/out-of-scope behavior before editing code.
- For non-trivial work, create/update `tasks/todo.md` with checklist items and verification steps.

## 2) Branching
- Start from up-to-date `main`:
  - `git switch main`
  - `git pull --ff-only`
- Create a focused branch with a descriptive name:
  - bug fix: `fix/<area>-<issue-or-topic>`
  - feature: `feat/<area>-<feature-topic>`

## 3) Implementation
- Prefer root-cause fixes over patch layering.
- Keep blast radius small: touch the least code necessary.
- Preserve existing patterns unless the request explicitly changes them.
- For accessibility changes, treat semantics, keyboard behavior, and visible focus as first-class requirements.

## 4) Verification (Required Before PR)
- Run syntax/build/tests relevant to changed files.
- Validate behavior against acceptance criteria, including regressions in adjacent flows.
- For UI/a11y changes, include keyboard path checks and pointer checks.
- If any expected verification cannot run in the current environment, document it explicitly as a gap.

## 5) Task Log Updates
- Update `tasks/todo.md` as work progresses.
- Add a short `Review / Results` section with:
  - what changed
  - verification commands/results
  - known gaps/follow-ups

## 6) Pull Request Standards
- Open one focused PR per coherent unit of work.
- Title format: imperative + scope (optionally issue refs).
- PR description must include:
  - summary of changes
  - acceptance-criteria checklist
  - verification matrix (what passed, what is pending)
  - issue links (`Closes #<n>` when appropriate)
- Keep commits logically grouped and descriptive.

## 7) Merge and Post-Merge Cleanup
- After merge:
  - `git switch main`
  - `git pull --ff-only`
  - `git branch -d <feature-branch>`
  - `git push origin --delete <feature-branch>` (if still present)
  - `git remote prune origin`
- Confirm local repo is clean and tracking `origin/main`.

## 8) Corrections and Lessons
- If user feedback identifies a miss, append a new entry to `tasks/lessons.md`:
  - trigger/correction
  - root cause
  - prevention rule
  - actionable future check
