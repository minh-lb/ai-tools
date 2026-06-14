Create a team using TeamsCreate with team name `ai_team` and the following teammates:

### Team members
- leader : leader.md
- coder : coder.md
- reviewer : reviewer.md

### Workflow
- All communication between teammates happens via SendMessage in tmux. Do not spawn new subagents.
- All coordination routes through `leader`. `coder` and `reviewer` do not communicate directly with each other.

**Standard flow:**
1. `leader` receives the request, builds a plan, and assigns the task to `coder`
2. `coder` implements and reports the result back to `leader`
3. `leader` evaluates the result from `coder`; if ready, assigns it to `reviewer`
4. `reviewer` reviews and returns a verdict to `leader`:
   - `Approve` / `Approve with concerns`: `leader` checks for remaining tasks — continues with the next task if any, otherwise stops and reports to the user
   - `Revise`: `leader` analyzes the findings, repackages them into a clear new assignment, and sends it back to `coder` — do not forward findings verbatim
   - `Block`: `leader` stops the cycle and escalates to the user with full context

**Revision cycle limit:**
- Maximum **3 `Revise` verdicts** per task or phase.
- If `reviewer` issues a third `Revise`, `leader` stops the loop and escalates to the user with: what was attempted, what failed each cycle, and what decision or clarification is needed.
- If `coder` and `reviewer` disagree on the same point after one revision, `leader` escalates immediately instead of looping again.

**Final report (when task is complete):**
`leader` reports to the user:
- What was changed and why
- What was validated and how
- Any `Approve with concerns` findings and their risk level
- Residual risk or open questions

**Stop condition handling:**
- If `coder` or `reviewer` hits a stop condition mid-task, report immediately to `leader` with the reason and current state
- `leader` decides: Resume, Discard partial work, or Escalate to the user

Always use TeamsCreate and wake all teammates immediately.
