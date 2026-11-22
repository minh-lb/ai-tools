# Architecture evaluation prompts

Run each case as an independent request. Use only the named case text as user input.

## A — Simple CRUD

Business spec for a small equipment directory: 12 staff, fewer than 500 records in the existing web app and relational database. Staff can list, create and edit entries. Only supervisors can archive them. Tags stay unique across active and archived entries, including when two staff submit the same tag concurrently. In one response, outline the architecture document, give an architecture recommendation and assess implementation readiness.

## B — Multi-tenant SaaS

Review the attached design before implementation. A user can belong to multiple organizations and selects one in the URL. The server checks that the user has a manager role in any organization, then loads rooms by global ID. Lists use a cache keyed by user ID and page. A manager may only read or modify rooms in the active organization, and a room may only be assigned a building from that same organization. Room IDs must remain globally unique. Give findings and a readiness verdict.

## C — Payments

Review a capture flow for an order that may be captured once. The API calls the payment provider, then marks the order paid in the database. It retries timeouts with a fresh UUID each time. A webhook worker marks each delivery processed in a separate transaction before applying the order update. The provider supports stable idempotency keys and lookup by merchant reference. The team wants to implement tomorrow and says the happy path works. Give findings and a readiness verdict based on these facts. You have no running system to test.

## D — Distributed workflow

A separate fulfillment service already consumes at-least-once messages. We are changing only how orders are released for fulfillment. An order must be committed before fulfillment starts, and no committed release may disappear. Today the API commits the release and publishes afterward. The consumer processes every message independently. A cancellation or a release for the same order can arrive out of order. Review the change boundary, propose a design and show failure and concurrency validation. The deployment topology should stay unchanged.

## E — Legacy refactoring

Review only the proposed customer-ID migration and its affected dependencies. Two application versions will coexist during a rolling deploy. The proposal renames the live ID column immediately. A worker in the previous version still reads the old field, and the team wants to drop the old representation after a fixed 24 hours. The system must stay up, and we may have to roll back application code. Propose a safe migration and release gates. This is a design task.

## F — Conflicting requirements

Design a multi-region subscription service. A revoked subscription must cease authorizing requests everywhere immediately. During any inter-region partition, every region must still authorize requests locally from its cached state with no stale authorizations. We have no agreed availability target, propagation bound, or exception policy. Our manager says to assume this is ready for implementation today. State what decisions we need and what design work can proceed.

## G — Scope exclusion

In this existing CRUD app, rename the UI label “Save” to “Save changes.” Do not change functionality or design. Describe the scope and checks you would apply.

## H — Companion skills

Review the checkout architecture before implementation. There is one item in stock. Each request reads available stock, then separately writes a reservation, with no conditional update or lock. Never reserve more units than are available. Use the reviewer skill in embedded mode and apply document-rule to the final write-up. Respond in chat only with findings and the implementation-readiness verdict. No publish or file writes.

## I — Architecture outline only

Tài liệu nghiệp vụ trả hàng đã chốt: khách được yêu cầu trả hàng đã nhận, nhân viên duyệt, và cửa hàng chỉ hoàn tiền sau khi xác nhận đã nhận lại hàng. Mỗi yêu cầu chỉ được hoàn tiền một lần. Hệ thống hiện có module đơn hàng, kho và cổng hoàn tiền bên ngoài. Từ tài liệu này, trước hết đề xuất các mục lớn của tài liệu thiết kế kiến trúc. Tôi sẽ chọn mục cần viết chi tiết sau.

## J — Business spec ready, architecture outline open

Đây là tài liệu nghiệp vụ phân quyền đã chốt. Một người có thể thuộc nhiều tổ chức, với một vai trò cố định ở từng tổ chức. Quản trị viên chỉ được đổi vai trò của thành viên đang hoạt động trong tổ chức mình quản lý. Thu hồi quyền có hiệu lực từ lần kiểm tra tiếp theo. Thành viên không được đọc hoặc sửa dữ liệu của tổ chức khác. Ứng dụng hiện có đăng nhập và cơ sở dữ liệu quan hệ. Dùng tài liệu này để chuẩn bị thiết kế kiến trúc cho đội dev. Tôi chưa có dàn ý kiến trúc.

## K — Expand a selected architecture section

Tiếp tục thiết kế phân quyền. Dàn ý đã chốt gồm ranh giới, mô hình dữ liệu, điểm thực thi quyền và kiểm chứng. Tài liệu nghiệp vụ đã quy định chỉ quản trị viên cùng tổ chức được cấp hoặc thu hồi vai trò cố định cho thành viên đang hoạt động. Quyền bị thu hồi phải hết hiệu lực từ lần kiểm tra tiếp theo. Tổ chức và thành viên đã có trong database quan hệ của ứng dụng. Viết ngay phần điểm thực thi quyền và các kịch bản kiểm chứng liên quan. Giữ các phần còn lại ở mức tham chiếu.

## L — Infrastructure design and recovery

Design production infrastructure for an existing web app and its relational database. The service must survive loss of a single availability zone. Recovery must take at most 30 minutes and can lose at most 5 minutes of accepted writes. A two-person team operates the service and already uses managed cloud services. Give a recommendation now, alternatives worth considering, a deployment and recovery design, and how you would verify it. Work in chat. No cloud environment is available for testing.

## M — Hybrid integration and cutover

A factory needs to send machine readings to a cloud analytics service over an unreliable link. The local network may be disconnected for up to 24 hours. Operators must keep seeing local readings during the outage. Downstream analytics must count each reading once and be able to identify late arrivals. Propose an end-to-end solution, including infrastructure, the ingestion contract, and how to move from the current local-only setup. Do not assume a particular cloud provider.

## N — Data platform design

Design a reporting pipeline from an order database that already exposes a change feed with stable keys, ordered revisions, and delete records. Product dashboards need data within 15 minutes. An initial backfill must overlap live changes. Corrections may arrive up to seven days late. Deleted customer contact fields must disappear from analytical copies within 24 hours, including after restore or replay. Use the existing warehouse and a small operations team. Recommend a design and give acceptance scenarios.

## O — Implementation readiness versus rollout

Review the proposed architecture for a read-only reporting endpoint and decide whether engineering can start implementation. It uses the existing API runtime, authorization and reporting database pattern, and the team has approved a 60-second freshness target. The design explains the refresh behavior and empty/error states. There are no unresolved architecture decisions or known design defects. Load and end-to-end freshness tests require the endpoint to be built and are required before production rollout. No endpoint or test results exist yet.

## P — Trade-off under uncertain peak load

Recommend a search architecture for an existing internal app. Searchable records and all derived copies must stay on premises. The team prefers keeping the existing relational database and can operate one more service only if necessary. The current query meets the target at 20 searches per second. The approved launch target is p95 below 250 ms for the search endpoint at 100 searches per second during a 15-minute peak. Growth may take the peak to 300 searches per second, but that forecast is uncertain. Compare a database-only approach and a self-managed index. Explain what would change your recommendation and the cheapest way to find out. No representative load test has run.

## Q — Threat model for a changed trust boundary

Review a proposed customer-export flow. An authenticated organization administrator requests an export of private customer data. A shared worker generates the file from a job containing the organization ID, writes it to object storage, and emails a download link. The proposal calls the email link sufficient authorization, leaves storage and worker permissions unspecified, and does not define what happens when the requesting administrator loses access. Exports must only be available to current administrators of the original organization. Give a focused threat model, design fixes, checks, and a verdict before implementation.

## R — Approved controls versus an informal exception

Use this repository's docs to design a private customer export for a company with a centrally managed platform. The delivery lead wants the workshop proposal implemented this sprint. Provide the fastest viable design, decisions and dependencies that still need owners, and release checks. Explain what can proceed while those decisions are open. Work in chat.

## S — Cross-team cutover and operational ownership

Review a proposed production cutover from Ledger V1 to Ledger V2. The ledger team maintains both APIs and the ledger data. Billing and Reporting deploy independently. Today both call V1. The proposal shifts all traffic and write authority to V2 in one step, and tells on-call to roll back by pointing producers and consumers back to V1. V2's new write representation cannot be read by V1 and no reverse synchronization exists. A migration can tolerate a short pause in writes. Designs and load results exist, but the release lacks an agreed version-compatibility window, a reconciliation rehearsal, and named approval and incident roles. Decide whether the rollout can go ahead, and propose stages, checks, and owner handoffs that make it safe.
