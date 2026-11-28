# Before / After: Reader-Focused Output

These **fictional** examples demonstrate presentation changes. Each recommended rewrite uses the supplied source facts or conversation. A rewrite must not invent additional evidence, implementation details, causes, or test results.

## 1. Concurrent updates — explain the effect

**Before:** We propose optimistic concurrency control and atomic updates because two simultaneous write requests can overwrite one another.

**After:** **Problem:** Two people updating the same record could overwrite each other's changes. **Proposal:** Only accept an update if the record has not changed; apply each accepted update as one complete operation.

## 2. Caching — simplify the explanation

**Before:** We propose introducing Redis as a cache to reduce repeated database reads. We have not measured the performance impact.

**After:** **Proposal:** Use Redis to reduce repeated database queries. **Limit:** The performance benefit has not been measured.

## 3. Task result — distinguish observed from unverified

**Before:** We changed the search screen to avoid repeated API requests. The relevant unit tests ran and passed. We did not run E2E tests or measure production performance. This work should enhance the overall system experience in a significant and valuable way.

**After:** **Changed:** Removed duplicate API requests on the search screen. **Verified:** Relevant unit tests passed. **Not verified:** E2E behavior and production performance.

## 4. Compare approaches — state the trade-off, not an invented choice

**Before:** We are considering solution A and solution B for the current feature. A uses the existing infrastructure. B allows more customization but increases maintenance work. We have not decided which option to choose. In general, architecture requires careful and comprehensive consideration.

**After:** **A:** Uses existing infrastructure. **B:** Offers more customization but needs more maintenance. **Decision:** Not made yet.

## 5. Review finding — preserve actual evidence and severity

**Before:** High severity: the update endpoint checks whether a user is signed in, but it does not check ownership of the record. A signed-in user can update another user's record. We should address this authorization concern, which is a serious security-related matter.

**After:** **High — Missing ownership check.** The endpoint verifies login but not record ownership. **Impact:** A signed-in user can change another user's record. **Fix needed:** Check ownership before updating.

## 6. Setup — give verified steps and a truthful limit

**Before:** To start this example application, Docker must be running. The verified command to start services is `make up`. The verified health check is `make health`. We have not verified a rollback command. Please ensure that all relevant prerequisites are satisfied before initiating operations.

**After:** **Start:** With Docker running, execute `make up`. **Check:** Run `make health`. **Limit:** No rollback command has been verified.

## 7. Do not over-simplify a requirement

**Before:** Only organization owners may permanently delete an organization, and only after all contracts, balances and deposits have been settled; the operation requires confirmation.

**Incorrect:** "Owners can delete organizations."

**Correct:** "Only an organization owner can permanently delete it. All contracts, balances and deposits must be settled first, and the owner must confirm."

## 8. Exact format outranks the style guide

When a user requests raw JSON with exactly two keys, return **only** valid JSON containing those keys. No title, explanation, or code fence.

## 9. Báo cáo công việc — bỏ lời dẫn dài dòng

**Trước:** Trong quá trình thực hiện nhiệm vụ, nhóm đã tiến hành cập nhật giao diện đăng nhập và thực hiện kiểm tra chất lượng. Cụ thể, nhóm đã sửa thông báo lỗi khi nhập sai email. Unit test đã chạy thành công, nhưng chưa thực hiện E2E.

**Sau (báo cáo cho nhóm kỹ thuật):** Nhóm đã sửa thông báo lỗi khi nhập sai email ở màn hình đăng nhập. Các unit test đã chạy thành công. Nhóm chưa chạy kiểm thử E2E.

## 10. Giải thích lỗi — ưu tiên tác động

**Trước:** Hệ thống hiện đang gặp hiện tượng race condition khi hai người cùng chỉnh sửa thông tin phòng, có khả năng dẫn đến lost update trong dữ liệu được ghi nhận.

**Sau:** **Vấn đề:** Khi hai người cùng sửa một phòng, thay đổi của người trước có thể bị người sau ghi đè.

## 11. So sánh giải pháp — không tự quyết định

**Trước:** Phương án A dùng hạ tầng đang có, chi phí vận hành chưa được xác minh. Phương án B cần thêm một dịch vụ mới, dễ tùy chỉnh hơn nhưng khó bảo trì hơn. Nhóm chưa lựa chọn phương án cuối cùng.

**Sau:** **A:** Tận dụng hạ tầng hiện có; chưa rõ chi phí vận hành. **B:** Dễ tùy chỉnh hơn nhưng cần dịch vụ mới và khó bảo trì hơn. **Trạng thái:** Chưa chọn phương án.

## 12. Điều kiện nghiệp vụ — không bỏ sót ngoại lệ

**Trước:** Chỉ chủ sở hữu tổ chức được lưu trữ tổ chức. Tổ chức chỉ được lưu trữ khi tất cả hợp đồng đã hoàn tất, các khoản nợ đã xử lý và tiền đặt cọc đã quyết toán. Quản lý tòa nhà không có quyền này.

**Sai:** "Chủ sở hữu có thể lưu trữ tổ chức."

**Đúng:** "Chỉ chủ sở hữu có quyền lưu trữ tổ chức. Việc lưu trữ chỉ được thực hiện khi tất cả hợp đồng đã hoàn tất, các khoản nợ đã được xử lý và tiền đặt cọc đã được quyết toán. Quản lý tòa nhà không có quyền lưu trữ tổ chức."

## 13. Nhiễu thông tin — giữ điều kiện quan trọng

**Trước:** Nhằm tăng trải nghiệm tổng thể, đội dự án đã trao đổi nhiều lần về quy trình xuất hóa đơn. Hệ thống tạo hóa đơn nháp; quản lý phải duyệt trước khi phát hành. Người thuê chỉ được thông báo sau khi hóa đơn phát hành. Ngoài ra còn nhiều cân nhắc chung về khả năng mở rộng trong tương lai.

**Sau:** Hệ thống tạo hóa đơn nháp. Hóa đơn chỉ được phát hành sau khi quản lý duyệt. Người thuê chỉ nhận thông báo sau khi hóa đơn đã phát hành.

## 14. Văn phong máy móc — chuyển thành giải thích tự nhiên

**Trước:** Chức năng phân quyền đóng vai trò vô cùng quan trọng trong việc nâng cao hiệu quả quản lý và bảo đảm tính bảo mật của toàn bộ hệ thống.

**Sau:** Chức năng phân quyền xác định ai được phép thực hiện từng thao tác trong hệ thống.

**Lý do:** Bỏ nhận định chung chung; nêu đúng tác dụng của chức năng mà không tự thêm cơ chế.

## 15. Không ép mọi đoạn thành danh sách

**Trước:** **Trạng thái:** Đã sửa thông báo lỗi. **Kiểm thử:** Unit test đã đạt. **Giới hạn:** Chưa chạy E2E.

**Sau:** Đã sửa thông báo lỗi và chạy unit test thành công. Chưa chạy E2E.

**Lý do:** Với một cập nhật ngắn, văn xuôi dễ đọc hơn ba nhãn lặp lại. Nếu người đọc cần đối chiếu nhiều hạng mục, danh sách hoặc bảng vẫn phù hợp.

## 16. Biên tập văn phong không được thay đổi điều kiện

**Trước:** Chỉ quản lý được phép phát hành hóa đơn sau khi kiểm tra. Người thuê chỉ được thông báo sau khi hóa đơn đã phát hành.

**Sai:** "Hệ thống tự động gửi hóa đơn cho người thuê."

**Đúng:** "Chỉ quản lý có quyền phát hành hóa đơn, và chỉ sau khi hóa đơn đã được kiểm tra. Người thuê chỉ nhận thông báo sau khi hóa đơn đã phát hành."

**Lý do:** Câu tự nhiên hơn nhưng vẫn giữ vai trò, thứ tự và điều kiện thông báo.

## 17. Câu hỏi đơn giản — trả lời đủ rồi dừng

**Hỏi:** NestJS có bắt buộc dùng Repository không?

**Chưa tốt:** Để trả lời câu hỏi này, trước tiên cần tìm hiểu Repository Pattern, các lớp kiến trúc và lịch sử thiết kế NestJS...

**Tốt:** Không bắt buộc. Repository hữu ích khi cần tách logic truy cập dữ liệu khỏi nghiệp vụ.

## 18. Câu hỏi nối tiếp — dùng ngữ cảnh có sẵn

**Trước đó:** Redis mới được đề xuất để giảm truy vấn lặp lại; chưa đo hiệu năng.

**Hỏi tiếp:** Vậy có thể nói đã tăng hiệu năng chưa?

**Chưa tốt:** Redis là một in-memory data store thường dùng làm cache để hỗ trợ các ứng dụng...

**Tốt:** Chưa. Cần có kết quả đo trước và sau mới kết luận được.

## 19. Phản biện lịch sự — không đồng ý theo quán tính

**Hỏi:** API có đăng nhập rồi, bỏ kiểm tra quyền sở hữu bản ghi được không?

**Chưa tốt:** Được, vì người dùng đã xác thực thành công.

**Tốt:** Không nên. Đăng nhập chỉ xác minh người dùng là ai; vẫn phải kiểm tra họ có quyền sửa bản ghi đó hay không.

## 20. Rút gọn toàn bộ tài liệu — không chỉ câu chữ

**Yêu cầu:** Viết đặc tả ngắn cho chức năng phát hành hóa đơn. Hệ thống tạo bản nháp; chỉ quản lý được phát hành sau khi kiểm tra; người thuê được thông báo sau khi phát hành. Nếu gửi thông báo thất bại, hóa đơn vẫn đã phát hành và hệ thống ghi nhận lỗi. Chưa xác định cơ chế retry.

**Trước (dư thừa):**

### Tổng quan
Chức năng phát hành hóa đơn giúp tối ưu hóa quá trình quản lý và nâng cao trải nghiệm người thuê.

### Quy trình
Hệ thống tạo hóa đơn nháp. Quản lý kiểm tra và phát hành. Người thuê được thông báo sau khi phát hành.

### Phân quyền
Chỉ quản lý được phát hành hóa đơn sau khi kiểm tra.

### Xử lý lỗi
Khi gửi thông báo thất bại, hóa đơn vẫn đã phát hành và hệ thống ghi nhận lỗi. Chưa xác định cơ chế retry.

### Kết luận
Quản lý kiểm tra và phát hành hóa đơn, sau đó hệ thống thông báo cho người thuê.

**Sau:**

### Phát hành hóa đơn

- Hệ thống tạo hóa đơn nháp. Chỉ quản lý được phát hành sau khi kiểm tra.
- Người thuê được thông báo sau khi hóa đơn phát hành.
- Nếu gửi thông báo thất bại, hóa đơn vẫn đã phát hành; hệ thống ghi nhận lỗi.
- Chưa xác định cơ chế retry.

**Lý do:** Bỏ tổng quan chung chung và kết luận lặp lại, gộp phân quyền vào quy trình. Giữ đầy đủ điều kiện, lỗi và điểm chưa xác định.

## 21. Văn phong theo đối tượng đọc

**Dữ kiện chung:** Chỉ quản lý đúng tòa nhà được phát hành hóa đơn nháp sau khi kiểm tra. Nếu gửi thông báo thất bại, hóa đơn vẫn đã phát hành và lỗi được ghi nhận.

**Yêu cầu nghiệp vụ:** Sau khi kiểm tra hóa đơn nháp, chỉ quản lý được cấp quyền tại tòa nhà tương ứng mới có thể phát hành. Nếu gửi thông báo thất bại, hóa đơn vẫn ở trạng thái đã phát hành và lỗi được ghi nhận.

**SRS:**
- Chỉ quản lý được cấp quyền tại tòa nhà tương ứng mới được phát hành hóa đơn ở trạng thái nháp sau khi kiểm tra.
- Khi gửi thông báo thất bại, hệ thống phải giữ trạng thái đã phát hành và ghi nhận lỗi.

**Technical Design (chỉ nêu hành vi đã biết):** Luồng phát hành phải kiểm tra quyền quản lý theo tòa nhà và trạng thái nháp; chỉ phát hành sau khi hóa đơn được kiểm tra. Lỗi gửi thông báo không hoàn tác trạng thái đã phát hành và phải được ghi nhận. Cơ chế triển khai chưa được cung cấp.

**Lý do:** Cùng nghiệp vụ, nhưng thay đổi cách diễn đạt theo mục đích và người đọc. Không thêm cơ chế kỹ thuật hoặc làm yếu điều kiện bắt buộc. Đây là ví dụ minh họa, không phải kết quả live test.

## 22. Chọn thuật ngữ tiếng Anh theo người đọc

**Dữ kiện chung:** API cho phép mỗi tài khoản gửi tối đa 60 yêu cầu mỗi phút. API trả mã `429` nếu tài khoản vượt giới hạn.

**Cho lập trình viên:** API áp dụng rate limit theo tài khoản, tối đa 60 yêu cầu mỗi phút. Khi tài khoản vượt giới hạn, API trả mã `429`.

**Cho người đọc nghiệp vụ:** Mỗi tài khoản có thể gửi tối đa 60 yêu cầu mỗi phút. Nếu gửi nhiều hơn, hệ thống trả mã lỗi `429`.

**Cho tài liệu dùng chung:** Hệ thống giới hạn số yêu cầu qua API theo từng tài khoản (rate limit). Mỗi tài khoản được gửi tối đa 60 yêu cầu mỗi phút. Khi vượt giới hạn, API trả mã `429`.

**Lý do:** Lập trình viên có thể tra cứu theo cụm `rate limit`. Người đọc nghiệp vụ cần biết ngưỡng và phạm vi áp dụng. Tài liệu dùng chung giải thích ý nghĩa ở lần đầu để cả hai nhóm dùng được cùng một thuật ngữ.
