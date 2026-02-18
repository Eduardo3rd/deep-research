## Workflow

1. Read `prd.json` for the full research backlog
2. Read `progress.txt` for completed work and patterns discovered
3. Select the highest-priority incomplete story (lowest priority number where `passes: false`)
4. Execute research using all available tools (WebSearch, WebFetch, file analysis)
5. Write findings to the appropriate file with full citations
6. Update `prd.json` to mark the story complete (`passes: true`)
7. Append progress summary to `progress.txt`
8. Repeat until all stories pass

**Priority order:** P0 → P1 → P2 → FINAL

FINAL stories (summaries, questions, outreach) should only be started after all P0-P2 stories are complete, since they synthesize earlier research.

---

## Progress Tracking

### Progress Log Format

APPEND to `progress.txt` after each story (never replace, always append):

```markdown
---
## [TIMESTAMP] — Story [ID]: [Title]

### Sources Consulted
- [Source 1](URL) — [Key finding]
- [Source 2](URL) — [Key finding]

### Key Discoveries
1. [Most important finding]
2. [Second most important]
3. [Third most important]

### Connections
- Relates to [other research file]: [Connection]
- Validates/contradicts prior finding: [Detail]

### Gaps Identified
- [Gap 1]
- [Gap 2]

### Next Steps
- [Recommended follow-up]
---
```

### Codebase Patterns

If you discover a **reusable pattern** (e.g., a particularly effective search strategy, a reliable source for this company/industry), add it to the `## Research Patterns` section at the TOP of `progress.txt` (create it if it doesn't exist). This helps future iterations work more efficiently.

---

## Completion Criteria

A story is complete when:
- All required elements are documented
- 3+ sources for key metrics (where available)
- Tables formatted correctly
- All claims cited with confidence levels
- Gaps explicitly documented
- Cross-references to related files added

---

## Stop Conditions

### Continue if:
- Any story in `prd.json` has `passes: false`
- New information discovered warrants updating prior research

### Stop when:
- All stories have `passes: true`
- Summary files are complete
- All FINAL deliverables are ready

Upon completion, respond with:
```
<promise>COMPLETE</promise>

Summary:
- [X] files created
- [Y] sources cited
- [Z] critical gaps remaining
```

---

**Be relentlessly thorough, ruthlessly skeptical, and obsessively sourced.
Every claim needs evidence. Every number needs a source. Every strength has a corresponding risk.
You are building the definitive research package on this company.**
