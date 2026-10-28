# Testing Rule

Skill hướng dẫn AI kiểm thử end-to-end (E2E) và frontend qua luồng sử dụng thực tế, kiểm tra kết quả có thể quan sát và báo cáo bằng chứng. Hỗ trợ chạy test có sẵn, kiểm tra tương tác bằng trình duyệt, viết automation khi được yêu cầu và chẩn đoán lỗi/flaky.

## Cách sử dụng

Khi skill đã được môi trường AI nhận diện, gọi `$testing-rule` trong yêu cầu. Nếu chưa được nhận diện, yêu cầu AI đọc [SKILL.md](SKILL.md) và áp dụng các reference phù hợp. Giữ nguyên thư mục `references/` cùng với skill.

Ví dụ yêu cầu chạy test:

```text
Dùng $testing-rule kiểm thử E2E luồng tạo và sửa bản nháp trên môi trường local.
Đọc yêu cầu trong docs/features/drafts.md và dùng runner có sẵn của dự án.
Kiểm tra dữ liệu còn đúng sau khi reload. Báo cáo kết quả, lỗi và phần chưa test.
```

Ví dụ yêu cầu kiểm tra frontend chi tiết:

```text
Dùng $testing-rule kiểm tra frontend trang tìm kiếm và form chỉnh sửa hồ sơ.
Kiểm tra validation, loading/empty/error, retry, response đến sai thứ tự,
điều hướng, responsive, keyboard và focus theo yêu cầu của dự án.
Dùng môi trường test và dữ liệu giả; ghi rõ viewport và các mô phỏng đã dùng.
```

Ví dụ yêu cầu viết automation:

```text
Dùng $testing-rule bổ sung E2E regression test cho lỗi submit hai lần.
Dùng framework và fixtures hiện có, kiểm tra kết quả lưu thực tế,
chạy test liên quan và báo cáo bằng chứng. Không thay đổi logic sản phẩm.
```

Các đường dẫn và tính năng trong ví dụ chỉ mang tính minh họa; thay bằng thông tin thật của dự án.

## Thông tin nên cung cấp

- **Phạm vi:** tính năng, luồng người dùng, thay đổi hoặc lỗi cần xác minh.
- **Kết quả mong đợi:** acceptance criteria, thiết kế hoặc tài liệu nghiệp vụ đã được chấp thuận.
- **Môi trường:** URL hoặc cách khởi động ứng dụng, tài khoản theo vai trò và dữ liệu test. Cung cấp cách truy cập credential an toàn, không dán secret vào prompt.
- **Mức kiểm thử:** smoke cho luồng chính, regression cho hành vi có nguy cơ ảnh hưởng, hoặc exploratory để khảo sát vấn đề chưa rõ.
- **Giới hạn:** trình duyệt/thiết bị cần hỗ trợ, hành động được phép và có cần viết hoặc sửa automation không.

AI sẽ đọc cấu hình và quy ước sẵn có trước; không cần cung cấp lại thông tin đã có trong repo. Nếu thiếu công cụ, tài khoản hoặc yêu cầu quan trọng, AI phải nêu rõ phần bị chặn hoặc chưa có tiêu chí đánh giá.

## Phạm vi frontend

| Nhóm | Nội dung kiểm tra khi phù hợp |
|---|---|
| Giao diện | Nội dung, dữ liệu đúng bản ghi, loading/empty/error, tràn chữ, chồng lấn, hình ảnh và so sánh thiết kế/baseline. |
| Điều hướng và component | Deep link, reload, back/forward, menu, tab, dialog, tìm kiếm, bộ lọc, phân trang và upload/download. |
| Form | Input hợp lệ/không hợp lệ, validation, lỗi từ server, giữ dữ liệu, submit lặp, retry, cancel và kết quả lưu. |
| Bất đồng bộ | Mạng chậm/lỗi, response cũ đến muộn, optimistic update bị từ chối, chuyển trang khi request chưa xong. |
| Responsive và accessibility | Layout hẹp/rộng, touch, zoom khi liên quan, bàn phím mobile, tab order, focus, modal, nhãn và trạng thái accessible. |

Chọn các kiểm tra theo tính năng và rủi ro; không bắt buộc chạy toàn bộ ma trận cho mọi thay đổi. Ảnh chụp giao diện không thay thế kiểm tra tương tác, persistence hoặc accessibility.

## Cấu trúc và tiết kiệm token

[SKILL.md](SKILL.md) chứa quy trình chung và bảng chọn reference. Với smoke có sẵn và đủ cấu hình, chỉ cần entrypoint; AI chỉ mở reference khi quyết định hoặc rủi ro hiện tại cần hướng dẫn chi tiết. Không tải toàn bộ thư viện hoặc đọc lại tài liệu không đổi. README phục vụ người dùng, không bắt buộc nạp khi chạy test.

So với bản trước chỉnh sửa, entrypoint giảm từ 513 xuống 387 từ (khoảng 25%). Luồng smoke đủ cấu hình giảm lượng hướng dẫn phải đọc từ 1.239 xuống 387 từ (khoảng 69%) nhờ bỏ yêu cầu đọc mặc định hai reference. Đây là số từ của tài liệu, không phải số token đo trực tiếp hoặc mức giảm tổng chi phí phiên làm việc.

| Reference | Khi cần đọc |
|---|---|
| [Scope and test design](references/scope-and-design.md) | Chọn luồng, tiêu chí đánh giá và phạm vi. |
| [Environment and data](references/environment-and-data.md) | Chuẩn bị môi trường, account, dữ liệu và cleanup. |
| [Browser execution](references/browser-execution.md) | Thao tác và quan sát kết quả bằng trình duyệt. |
| [Frontend checks](references/frontend-checks.md) | Kiểm tra màn hình, điều hướng, component và hình ảnh. |
| [Frontend forms and state](references/frontend-forms-and-state.md) | Kiểm tra form, validation, async và race condition. |
| [Frontend accessibility and responsive](references/frontend-accessibility-and-responsive.md) | Kiểm tra responsive, touch, keyboard, focus và accessibility. |
| [Automation](references/automation.md) | Viết/sửa test tự động và chạy CI. |
| [Failure diagnosis](references/failure-diagnosis.md) | Điều tra test lỗi, timeout hoặc flaky. |
| [Evidence and reporting](references/evidence-and-reporting.md) | Tổng hợp bằng chứng, kết quả và giới hạn. |

## Đọc kết quả

Báo cáo cần nêu phạm vi, môi trường, lệnh hoặc thao tác đã chạy, kết quả, bằng chứng, lỗi có thể tái hiện và phần còn thiếu.

| Trạng thái | Ý nghĩa |
|---|---|
| Passed | Đã chạy và đáp ứng kết quả mong đợi trong môi trường được ghi nhận. |
| Failed | Kiểm tra đã chạy nhưng kết quả khác tiêu chí đã xác định. |
| Blocked | Thiếu điều kiện, công cụ hoặc quyền để chạy hợp lệ. |
| Pending-spec | Chưa có tiêu chí đáng tin cậy để kết luận đúng/sai. |
| Not run / skipped | Chưa thực thi; phải ghi lý do. |

Flaky là thông tin bổ sung: phải giữ kết quả lần lỗi và lần retry, không gộp thành pass sạch. Test local có mock không chứng minh tích hợp thật hoặc production hoạt động. Viết được test cũng chưa có nghĩa là test đã chạy thành công.

Timeout sau thao tác ghi có thể xảy ra khi server đã xử lý thành công. AI phải đối chiếu trạng thái trước khi retry; nếu chưa xác định được kết quả thì dừng thao tác đó và báo cáo phần chưa rõ. Exit code 0 của runner cũng chưa đủ để kết luận sẵn sàng phát hành nếu tiêu chí bắt buộc còn thiếu bằng chứng.

## Giới hạn và an toàn

Skill là hướng dẫn, không cung cấp sẵn trình duyệt, runner, tài khoản hoặc môi trường chạy. AI ưu tiên công cụ hiện có của dự án; khả năng thực thi phụ thuộc phiên làm việc thực tế.

Yêu cầu test không tự cấp quyền thanh toán thật, gửi thông báo thật, thay đổi dữ liệu người khác hoặc xóa dữ liệu sẵn có. Chỉ dùng dữ liệu thuộc lượt test và cleanup trong phạm vi được phép. Log, screenshot và trace phải được bảo vệ, loại bỏ secret trước khi chia sẻ.
