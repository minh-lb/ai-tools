# Quy tắc in trực tiếp / chỉ in đúng phần

## Phân biệt yêu cầu

| Lệnh | Output phải làm |
|---|---|
| "In Acceptance Criteria" | Chỉ section Acceptance Criteria |
| "Chỉ in JSON" | Raw JSON hợp lệ; không prose, không Markdown fence |
| "In Spec đầy đủ" | Toàn văn Spec trong phạm vi yêu cầu; không thay bằng summary |
| "Tóm tắt Plan 5 dòng" | Đúng bản tóm tắt; không in Plan toàn văn |
| "Review, chỉ trả findings" | Findings + vị trí + ảnh hưởng + đề xuất sửa; không rewrite |
| "Viết Spec và Plan" | Hai deliverables theo thứ tự Spec → Plan |
| "Fix bug validation message" (nhỏ, không yêu cầu tài liệu) | Thay đổi code + kết quả kiểm chứng; **không tự tạo file Plan** |

## Không làm

- Không thêm "Dưới đây là...", "Tôi đã chuẩn bị..." khi user yêu cầu output thuần.
- Không thêm section `Open Questions` hoặc phần giải thích nếu user yêu cầu một section cụ thể và thông tin chưa xác định không thuộc section ấy (trừ điều kiện bắt buộc phải công khai).
- Không đặt JSON trong code fence khi output contract là raw JSON.
- Không "chỉnh cho đẹp" khiến nội dung được trích xuất mất field, rule, error hoặc thứ tự yêu cầu.

## Preserve vs transform

- **Trích nguyên văn:** giữ chữ, ký hiệu, số liệu, IDs và thứ tự đúng nguồn; không paraphrase.
- **Tái cấu trúc/chuẩn hóa:** có thể đổi trình bày nhưng giữ semantics.
- **Tóm tắt:** nén ý theo yêu cầu; không tuyên bố đó là bản đầy đủ.
- **Hiệu đính:** sửa lỗi ngôn ngữ, không tự quyết định rule còn thiếu.

Ví dụ: [only-section](../../examples/output/only-acceptance-criteria.md), [JSON only](../../examples/output/json-only.md), [full vs summary](../../examples/output/full-vs-summary.md).
