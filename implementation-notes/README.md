# implementation-notes

Skill ghi lại những quyết định quan trọng AI đã đưa ra trong lúc triển khai để người review đối chiếu với spec, code và kết quả kiểm chứng.

Ý tưởng dựa trên [bài đăng của Thariq](https://x.com/trq212/status/2056415973125796184) và [bản viết lại chi tiết](https://x.com/trq212/status/2056418157305454805) về việc duy trì implementation notes trong khi triển khai.

## Khi dùng

Dùng khi yêu cầu triển khai có nhắc đến `implementation notes`, nhật ký quyết định, chỗ lệch spec, tradeoff hoặc tài liệu bàn giao cho reviewer. Ví dụ:

```text
Triển khai theo spec này và dùng $implementation-notes để ghi lại các quyết định ngoài spec.
```

Skill chỉ tạo `implementation-notes.md` để đọc và sửa cùng spec/code. Nếu không chỉ định đường dẫn, file nằm cạnh spec; khi không có spec file, nằm trong `docs/implementation-notes/<task-slug>/`. Không ghi đè note của task khác.

## Nội dung cần có

- Quyết định khi spec mơ hồ hoặc chưa nêu rõ.
- Chỗ chủ ý thay đổi so với yêu cầu ban đầu và lý do.
- Tradeoff: phương án đã cân nhắc và vì sao chọn cách hiện tại.
- Câu hỏi cần người yêu cầu xác nhận hoặc sửa lại.

Tạo note sớm và cập nhật trong lúc triển khai, thay vì chỉ viết hồi tưởng ở cuối. Trạng thái quyết định (đã chốt hay còn chờ) và kết quả kiểm chứng là hai thông tin riêng. Bằng chứng đã chạy và giới hạn kiểm chứng giúp người review đối chiếu.

Khi phần triển khai ảnh hưởng một luồng, note cần **một sơ đồ Mermaid so sánh trước/sau** đầy đủ trong phạm vi bị ảnh hưởng: điểm vào, các bước chính, nhánh quyết định/lỗi quan trọng và kết quả ở cả hai phía. Logic cũ có nhãn `LOGIC CŨ`; logic hiện tại đã thay đổi có nhãn `ĐÃ ĐỔI` và màu khác; bước giữ nguyên có kiểu trung tính. Đối chiếu luồng cũ với code/test/spec trước khi sửa, luồng mới với code cuối cùng; nếu không xác minh được logic cũ thì ghi rõ thay vì suy đoán. Sơ đồ nằm ngay trong file Markdown; chỉ bỏ khi thay đổi không có luồng đáng mô tả. [GitHub render Mermaid](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams) trong Markdown và PR; viewer khác cần hỗ trợ Mermaid để hiển thị sơ đồ.

Chỉ ghi các quyết định ảnh hưởng đến hành vi, phạm vi, giao diện hoặc khả năng review. Mỗi nhận định quan trọng nên dẫn đến spec, code hoặc kết quả kiểm tra liên quan. Note không thay thế cho test hay sự chấp thuận của người dùng.

## Liên hệ với living specification

Gojko Adzic mô tả tài liệu sống là các quy tắc và ví dụ hành vi dễ hiểu, được kiểm tra thường xuyên và cập nhật khi hiểu biết về sản phẩm thay đổi. [Cucumber](https://cucumber.io/docs/) cũng dùng các ví dụ có thể thực thi để đối chiếu hành vi; [Example Mapping](https://cucumber.io/docs/bdd/example-mapping/) tách quy tắc, ví dụ và câu hỏi chưa có lời giải. Xem [chương mẫu *Specification by Example*](https://manning-content.s3.amazonaws.com/download/d/5a22dfb-908c-408d-aaa1-46873b6b18c9/adzic_ch02.pdf).

Skill áp dụng phần phù hợp: note liên kết quyết định với spec, ví dụ hành vi và bằng chứng kiểm chứng; câu hỏi chưa chốt không trở thành yêu cầu. Khi có quyết định được chấp thuận, cập nhật spec và ví dụ/test liên quan trong phạm vi task, rồi dẫn lại từ note. File note riêng không tự biến thành living spec và skill không bắt buộc dùng Cucumber hay một framework mới.

Skill hoạt động độc lập; sao chép cả thư mục `implementation-notes/` vào nơi runtime đọc skills. Không cần MCP, mạng hoặc package ngoài để viết Markdown.

## Mẫu và ví dụ

Đọc [template Markdown](templates/implementation-notes.md) khi tạo note; mở [example giả định](examples/implementation-notes.md) khi cần xem cách trình bày. Cả hai dùng Mermaid cho sơ đồ.

Template là khung chọn lọc: bỏ mục không áp dụng, thay mọi placeholder và kiểm tra lại link trước khi giao. Example chỉ minh họa cách viết; các đường dẫn code và số liệu trong đó là giả định, không phải bằng chứng của một task thật.
