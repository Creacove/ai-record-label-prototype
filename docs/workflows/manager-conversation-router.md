# Manager Conversation Router

Purpose: define how user conversations enter the proactive operating system. Conversation is one trigger among many; it is not the only front door to missions or work.

## Trigger

A conversation router run starts when:

- the user submits a new Manager Office prompt
- the user continues an existing conversation thread
- the user corrects, approves, rejects, or adds context
- the user responds to a permission request or evidence request

Other triggers such as agent reports, evidence changes, task results, and scheduled runs are handled by Manager synthesis and may create/update missions without a user message.

## Required Context

The router must load:

- active artist profile and artist operating memory
- current conversation thread and recent conversations
- active missions, mission patterns, and archived mission summaries
- mission memory for likely related missions
- open tasks, approval states, completion notes, and task results
- checkpoints, dependency states, review rules, and blocker states
- agent reports, agent notes, and specialist readiness
- evidence items and source limitations
- prior decision packages, rejected moves, directives, permission requests, and review dates
- approval boundaries for budget, external actions, rights, finance, legal, and reputation-sensitive actions

## Classification Logic

The router should classify the user message into one primary classification and optional secondary classifications.

| Classification | When to use | Write behavior |
| --- | --- | --- |
| Simple answer | User asks what the system already knows or asks for explanation | Store messages and run metadata; no artifact write unless memory-worthy |
| Strategic advice | User asks for guidance without a durable decision | Store advice; create decision package only if stakes or future action require it |
| Decision request | User asks what to do, whether to spend, approve, pause, continue, or change plan | Create decision package; may trigger Manager synthesis and artifact updates |
| Mission pattern candidate | User message suggests a durable objective, risk, or opportunity | Ask Manager synthesis to select/adapt a mission pattern or update existing mission |
| Existing mission update | User adds information about current mission work | Update task, checkpoint, memory, note, review, or permission state; do not create duplicate mission |
| Task creation candidate | User or Manager identifies a concrete human/team action | Create task with owner, purpose, dependency, linked checkpoint, evidence need, and approval state |
| Task result/update | User reports done, blocked, approved, rejected, revised, archived, superseded, or uploaded | Create task result/state event; update checkpoint and memory |
| Checkpoint review/update | New task/evidence/report state changes a mission question | Update checkpoint and possibly trigger review |
| Memory update | User gives durable context, constraint, correction, or preference | Create scoped memory entry with provenance |
| Evidence request response | User provides or refuses source/evidence | Create evidence item, source task, limitation, or review |
| Specialist referral | Topic needs a specialist lens | Create referral/note or request specialist report with source limits |
| Draft/work-product request | User asks for copy, outreach, pitch, calendar, checklist, or package | Create work draft; require approval before external use |
| Permission response | User approves, rejects, edits, or delays a permission request | Update permission request and related task/draft/action |
| Review trigger | User introduces information that may change a prior recommendation | Create review comparing previous and current state |
| Unsupported or unsafe | Request exceeds authority or lacks support | Explain boundary and offer safe next step |

## Background Steps

1. Normalize the user message and identify the active artist.
2. Detect references to known missions, patterns, tasks, checkpoints, sources, agents, permissions, reviews, budget, evidence gaps, or prior decisions.
3. Retrieve likely related artifacts, reports, evidence, and memory.
4. Classify intent and required write level.
5. Decide whether to answer directly or escalate to Manager synthesis.
6. If mission work is needed, ask Manager synthesis to select/adapt pattern and choose create/update/no-write.
7. Validate action plan against approval boundaries and evidence limitations.
8. Generate the Manager response with linked artifacts and limitations.
9. Persist conversation message, Manager message, run metadata, classification, evidence/report references, and action results.
10. Apply safe internal writes or create approval-gated pending actions.
11. Return updated UI state.

## Artifacts Created Or Updated

Possible outputs:

- `conversation_messages`
- `manager_runs` or `manager_synthesis_runs`
- `manager_run_actions`
- `decision_packages`
- `missions`
- `tasks`
- `task_results`
- `task_state_events`
- `checkpoints`
- `agent_notes`
- `memory_entries`
- `reviews`
- `work_drafts`
- `specialist_referrals`
- `permission_requests`
- `evidence_items` when user-provided context becomes evidence

## User-Facing Result

The user should see one clear response path:

- answer only for simple context
- decision package for serious management calls
- linked mission/task/checkpoint/note/memory when work changed
- mission update when the message belongs to an active objective
- missing evidence request when confidence is limited
- permission request when the next step is external, expensive, sensitive, legal, financial, public, or reputational
- specialist handoff or locked-agent limitation when needed

The UI should never imply that external work has happened unless an approved integration action actually occurred.

## Failure And Uncertainty Handling

If classification confidence is low, the Manager should ask a narrowing question instead of creating durable work. If a likely mission exists but match confidence is unclear, the Manager should say it found related mission context and ask whether to update it or continue as a separate objective.

If writes fail after response generation, the user-facing state must report that the answer was saved but linked work was not created. The run should remain auditable as partially failed.

If the user asks for work that belongs to a mission pattern the system does not know, the Manager may create an ad hoc mission plan with a narrow first checkpoint and a review.

## Approval Boundaries

The router may create internal records without approval when they represent conversation, memory, evidence limitation, draft, note, task proposal, checkpoint state, mission organization, or review state. It must require explicit approval for spend, public release-plan changes, external sends/submissions, rights or finance conclusions, legal-sensitive actions, and reputation-sensitive actions.

## Schema/API Implications

The router needs an explicit action-plan output, not freeform prompt text.

```ts
type ManagerRunPlan = {
  classification: string;
  confidence: "low" | "medium" | "high";
  relatedArtifactIds: string[];
  relatedReportIds: string[];
  missionPatternCandidate?: string;
  evidenceIds: string[];
  proposedActions: ManagerRunAction[];
  approvalRequired: boolean;
  limitations: string[];
};
```

The API should persist the run before executing writes, then update each action with `pending`, `applied`, `approval_required`, `failed`, or `skipped`.
