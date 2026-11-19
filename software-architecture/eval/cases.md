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
