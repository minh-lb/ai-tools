# Frontend — Common Testcase Library (87 checks, 17 components, 7 groups)

Use these as **procedure prompts**: include only components present in the feature and determine expected results from its specification. For each field, test applicable minimum/maximum and ±1 values, data variants, and specific messages. FE tests interaction/rendering; validate inputs again at BE.

## Text input (22)
- **Textbox (7):** empty; whitespace-only; boundary values; valid values; HTML/JavaScript (render safely, do not execute script); special characters; trim spaces.
- **Text area (8):** all textbox checks plus newline/multiline (preserved or normalized according to specification).
- **Number-only textbox (7):** empty; valid number; letters; special characters `,` and `.`; `0` (must not be treated as empty); boundaries; trim spaces. Confirm decimal/grouping separators for the locale.

## Email (7)
Empty; valid format (basic, dot/plus, subdomain, numeric local part, hyphen, underscore, long/multi-level TLD); invalid format; already exists; locked; previously deleted; trim spaces. System-state cases need specified results; consider account enumeration (do not reveal whether an account exists). Test on blur/submit as specified.

## Selection controls (17)
- **Combo box (4):** empty; option count against data source; select one; search options **if supported**.
- **Drop list (3):** empty; option count; select one.
- **Checkbox (4):** unchecked when required; default; check; uncheck (unchecked may be valid).
- **Radio button (3):** no selection; default; change option.
- **Switch (2):** default; toggle state.
- **Collapse/Expand (1):** default collapsed/expanded state (add interaction cases if used).
Do not hard-code option counts when configuration can change; expected output should name the data source. Add select-many/remove-option cases if supported.

## Date & time (20)
- **Date picker (10):** empty; default (today only if specified); format; invalid format; today; past; future; start=end; start>end; start<end.
- **Time picker (10):** empty; default (now only if specified); format; invalid format; current time; past; future; time1=time2; time1>time2; time1<time2.
The three range-comparison cases are **business rules**: confirm whether equality is allowed, whether validation blocks selection or submission, and whether changing start adjusts end automatically. Confirm timezone and format (`MM` month differs from `mm` minute); add leap day, DST, and midnight cases where relevant.

## File upload (8)
Empty; allowed format; disallowed format; exceeds size limit; remove after upload; multiple files; filename display; drag and drop. Confirm allowed types, maximum bytes (at limit and +1), maximum count (at limit and +1), and whether the filename appears at selection time or only after server response. Add zero-byte files, extension/MIME mismatch, and dragging from desktop/another website. FE `accept` does not secure the server.

## Display & design (5)
- **Label (1):** text matches specification/design.
- **Design (4):** all elements present; layout; font family; font color.
Each case needs a design link/version and applicable state/breakpoint; “matches design” without a reference is not verifiable.

## Navigation (8)
- **Pagination (5):** records per page match configuration; next; previous; jump to arbitrary page; pagination after search/filter (currently on page 3, last page shrinks after filtering, result count below one page).
- **Breadcrumb (3):** correct hierarchy; links navigate correctly; current page is disabled.
Test with lower-privilege roles to avoid exposing unauthorized paths; verify permissions at the API separately.
