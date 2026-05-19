# Notes, Memory, And Review Workflow

Purpose: define how agent notes, mission memory, artist memory, and reviews keep the operating system coherent.

## Trigger

This workflow starts when:

- Manager creates a decision package
- Manager prepares context for a locked or future specialist
- Manager sends a note/request to an agent inbox
- agent sends a finding or run summary back to Manager
- task results affect a mission
- checkpoint state changes
- evidence changes or arrives
- review date/time is reached
- user provides durable context or correction

## Required Context

- artist profile and artist memory
- mission and mission memory
- current conversation
- latest Manager run and decision package
- task results and checkpoint state
- related evidence and limitations
- specialist readiness and source needs
- pending Manager-to-agent notes and agent-to-Manager notes

## Source Data

Current prototype sources:

- `departmentBriefs`
- `decisionRecord`
- `artistOperatingMemory`
- `missionEvents`
- `missionReview`
- `taskResults`
- `evidence`

Production sources:

- `agent_notes`
- `agent_inbox_items`
- `agent_reports`
- `operating_events`
- `memory_entries`
- `memory_summaries`
- `outcome_observations`
- `reviews`
- `manager_runs`
- `decision_packages`
- `tasks`
- `task_results`
- `checkpoints`
- `evidence_items`

## Classification Logic

Create an agent note when information should be handed between Manager and another agent but does not require direct user approval.

Manager-to-agent notes should be treated as inbox items for the target agent. They can be consumed during the next relevant run unless the current conversation requires an immediate specialist read.

Agent-to-Manager notes should summarize run findings, evidence used, missing sources, and recommended internal actions. They can propose mission candidates, task candidates, checkpoint updates, reviews, or evidence requests. The Manager synthesis decides whether to apply them.

Create mission memory when information changes the story of the mission: goal, plan phase, task/checkpoint link, current state, decision, blocker, evidence gap, task result, checkpoint change, rejected alternative, or next review.

Create artist memory when information is durable beyond one mission: positioning, strategy, values, constraints, team capacity, budget posture, do-not-repeat, or recurring pattern.

Create review when a prior recommendation may change or must be confirmed.

Create outcome observation when later evidence can be compared against a prior recommendation, task, checkpoint, mission plan, or agent report. Outcome observations should preserve uncertainty, confounders, and causal limits.

## Background Steps

1. Identify whether the change is note-worthy, memory-worthy, review-worthy, or all three.
2. Write immutable note content if agent-to-agent handoff is needed.
3. If the note targets an agent, place it in that agent's inbox for the next relevant run unless marked immediate.
4. If the note comes from an agent, attach it to the run/report that produced it and feed it into Manager synthesis.
5. Write an operating event for the artifact/state change when the event affects future traceability.
6. Write scoped memory entries with provenance, confidence, and reason.
7. Generate or version updated mission and artist memory summaries from memory entries and operating events.
8. If recommendation is affected, create review record.
9. Compare previous recommendation with current state.
10. If enough later evidence exists, create an outcome observation with watched signals, confidence, confounders, and learning note.
11. Return updated note, memory, review, or recap UI.

## Artifacts Created Or Updated

- agent note
- agent inbox item
- operating event
- mission memory entry
- artist memory entry
- memory summary
- review
- outcome observation
- checkpoint state
- next task or evidence request where needed

## User-Facing Result

Notes should read like operational handoffs: sender, recipient, subject, message, evidence used, linked mission, and resulting change.

Run summaries from agents should be readable by the Manager and, where surfaced, by the user: what the agent checked, what it found, what it could not prove, and what it recommends the Manager consider.

Mission memory should read like an intelligence note, not a grid of fields. It should explain what happened, how tasks affected checkpoints, what changed in the mission path, what remains unresolved, and what the next useful move is. The visible recap is generated from append-only operating events and memory entries, not hand-edited as the source of truth.

Review should show what changed, what did not change, previous recommendation, Manager comparison, and available actions.

Outcome observations should show what was expected, what later signals showed, what remains uncertain, and whether the learning is artist-specific or eligible for aggregate pattern learning.

## Failure And Uncertainty Handling

If memory extraction confidence is low, store a narrower entry or ask a follow-up. If evidence conflicts, create a review and preserve both sides. If a specialist note depends on missing sources, mark it as a source request or future specialist request, not a completed specialist answer.

## Approval Boundaries

Notes and memory can be written internally when they summarize product activity. Sensitive artist assertions, legal/financial interpretations, public claims, and reputation-affecting conclusions require careful provenance and user visibility. Reviews can recommend change but cannot execute external action without approval.

## Schema/API Implications

Memory should be append-first with generated summaries. Notes should be immutable except status/resulting change. Agent inbox items should record whether they were consumed by a run. Reviews should link previous recommendation, triggering evidence/task/report, comparison, outcome, and next action.

Use `docs/workflows/memory-and-learning-contract.md` as the stricter authority for no-overwrite rules, outcome observations, cross-artist learning, and privacy-safe pattern outcomes.
