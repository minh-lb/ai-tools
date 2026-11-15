# Before / After: Reader-Focused Output

Examples are fictional and illustrate **presentation**, not approved technical designs or verified results. In every case, the "after" retains the information a reader needs.

## 1. Concurrent updates — explain the impact

**Before:** Implement optimistic concurrency control and atomic operations to mitigate the race condition between concurrent write requests.

**After:** **Problem:** Two people can update the same record at once and overwrite each other's changes. **Proposal:** Accept an update only if the record has not changed since it was read. **Expected benefit:** Prevent lost updates.

## 2. Caching — remove unnecessary mechanism

**Before:** We recommend introducing a Redis caching layer to optimize throughput and reduce pressure on the persistence subsystem via memory-resident key-value storage.

**After:** **Proposal:** Store frequently used data in Redis to reduce database queries. **Note:** The actual performance benefit still needs measurement.

## 3. Task result — distinguish observed from expected

**Before:** The application has been successfully optimized and all issues are resolved; the overall implementation has been carried out efficiently.

**After:** **Changed:** Reduced duplicate API requests in the search screen. **Verified:** The relevant unit tests passed. **Not verified:** Production performance; no benchmark was run.

The test result in this example is fictional; never use it without actual test evidence.

## 4. Compare approaches — lead with the decision

**Before:** There are many architectural considerations involving solution A and solution B, including extensibility, maintainability, operational complexity, and future architecture evolution.

**After:** **Recommendation:** Choose A for the current scope because it uses existing infrastructure. **Trade-off:** B may support more customization but adds maintenance work. **Open point:** Confirm whether that customization is required.

## 5. Review finding — keep the evidence

**Before:** The implementation has some security concerns related to insufficient validation in the access-control system.

**After:** **High — Missing permission check.** The update endpoint checks login but not whether the caller owns the record. **Impact:** A signed-in user could change another user's record. **Fix:** Check ownership before saving, then test the denied case.

This is a fictional finding; do not claim it applies to a real repository without source evidence.

## 6. Technical setup — make it actionable

**Before:** Ensure the container orchestration environment is correctly configured and that all requisite service dependencies have been initialized prior to proceeding.

**After:** **Before starting:** Make sure Docker is running. Then start the services using the command defined in the repository README. **Check:** Confirm the services are healthy. Do not invent an unverified command.

## 7. Do not over-simplify a requirement

**Before:** Only organization owners may permanently delete an organization, and only after all contracts, balances and deposits have been settled; the operation requires confirmation.

**Incorrect simplification:** "Owners can delete organizations."

**Correct:** "Only an organization owner can permanently delete it. Before deletion, all contracts, debts and deposits must be settled, and the owner must confirm the action."

## 8. Exact format outranks the style guide

If the user requests raw JSON with exactly two keys, output **only** parseable JSON with those keys. Do not attach a title, explanation, Markdown code fence, or extra fields.
