# Personalization Contract

Purpose: define how every Manager and agent output becomes artist-specific instead of generic music advice.

## Required Personalization Context

Every Manager or agent output must load:

- artist identity and aliases
- genre and market
- current stage
- current goal and active missions
- artist direction and positioning
- budget context
- active release or active focus object if relevant
- social handles and source availability
- artist operating memory
- mission memory when mission-specific
- prior decisions and rejected moves
- team capacity, owner roles, and constraints when known
- values, non-negotiables, do-not-do rules, and user overrides when known
- evidence confidence and missing source limitations

If a field is unknown, the output must either avoid relying on it or ask only when it materially changes the decision.

## Personalization Rules

- Use the artist's actual goal before optimizing for generic growth.
- Fit recommendations to the artist's stage, market, budget, source access, and team capacity.
- Do not recommend high-effort work if known capacity makes it unrealistic; create a smaller task or ask for permission/context.
- Do not treat all artists as release-driven. Some missions may be rights, data, touring, positioning, budget, or team operations.
- Cite profile assumptions when they materially affect the recommendation.
- Preserve long-term artist leverage over short-term metrics.
- Respect do-not-do rules unless the user explicitly changes them.

## Output Requirements

Every non-trivial Manager answer must include at least one of:

- artist-specific reason
- mission-specific reason
- evidence-specific reason
- memory-specific reason
- limitation explaining what is missing

Generic answer smell:

- could be sent to any artist unchanged
- ignores budget, stage, market, active missions, or source limitations
- recommends platform tactics without explaining fit
- gives confidence without evidence
- creates work unrelated to current goals

## Clarifying Questions

Ask a clarifying question only when:

- missing context materially changes the recommendation
- the action could be expensive, external, public, legal, financial, sensitive, or reputational
- mission pattern cannot be selected safely
- existing mission match is ambiguous

Do not ask questions that can be answered from profile, memory, evidence, source data, or prior conversations.

## Examples

Budget question: must use budget context, active mission state, current evidence confidence, holdback logic, and permission boundary.

Touring question: must use market, city evidence, live history if available, team capacity, and missing proof. If live history is missing, create source/evidence task before recommending a show.

Rights question: must use split sheets, metadata, ownership notes, and legal/finance limitation. If missing, create rights cleanup task or referral; do not conclude ownership.

Positioning question: must use artist direction, genre, market, prior memory, audience thesis, and do-not-repeat rules.

## Acceptance Checks

- Every generated answer can point to loaded personalization context.
- Every decision package includes artist-specific rationale.
- Every mission plan fits the mission pattern and artist constraints.
- Missing personalization context is either explicitly limited or requested.
