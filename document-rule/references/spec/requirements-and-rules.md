# Functional Requirements và Business Rules

## Câu viết chuẩn

- `FR-001`: Khi **[actor/trigger]** và **[điều kiện]**, hệ thống **PHẢI [hành vi]**, tạo ra **[observable result]**.
- `BR-001`: Chỉ khi **[điều kiện nghiệp vụ]** thì **[hành động/trạng thái]** được phép.
- `BR-002`: Nếu **[trường hợp bị cấm]**, hệ thống **PHẢI [error]**, và **KHÔNG [side effect]**.

Tách rule khi có điều kiện hoặc kết quả cần kiểm thử độc lập. Nêu thứ tự ưu tiên khi nhiều rule có thể đồng thời thỏa.

## Dùng decision table khi có nhiều điều kiện

| Authenticated | Owner | Status=PENDING | Expected |
|---|---|---|---|
| No | N/A | N/A | 401, không mutation |
| Yes | No | N/A | 403, không mutation |
| Yes | Yes | Yes | Cho phép hủy |
| Yes | Yes | No | 409, không mutation |

**Chỉ là ví dụ giả định**: code status/permission phải theo contract đã biết, không mặc định dùng bảng này cho dự án thật.

## Các trường hợp thường bị bỏ sót

- Input trống/sai kiểu/sai format, thiếu quyền.
- State không hợp lệ, thao tác lặp, duplicate message/request.
- Failure từ dependency và tình trạng dữ liệu sau thất bại.
- Concurrent modification/race nếu làm đổi state hoặc tồn kho/số dư.
- Timezone, rounding, priority khi phép tính phụ thuộc chúng.

Không thêm hành vi mới chỉ để "đủ coverage"; trường hợp chưa được quyết định phải ghi `Open questions`.
