# Architecture, Design và ADR

## Architecture / System Design

- Nêu goals/non-goals, ràng buộc, workload/actors, context.
- Các component và trách nhiệm, integration boundaries, data flow, trust boundary.
- Quyết định kỹ thuật có căn cứ: options, trade-offs, failure modes, scaling/observability/security.
- Contract/interface nổi bật và phương án migration khi thiết kế ảnh hưởng tương thích.
- Diagram chỉ khi giảm mơ hồ; không thay prose quan trọng bằng sơ đồ không thể truy cập.

## ADR

- **Context:** vấn đề và forces.
- **Decision:** một lựa chọn cụ thể và scope áp dụng.
- **Alternatives:** các lựa chọn đã cân nhắc, trade-offs.
- **Consequences:** được/mất, vận hành/khả năng đổi ý.
- **Status:** Proposed/Accepted/Superseded **chỉ khi có cơ sở**.

Đừng viết quyết định chưa được duyệt như sự thật. Nếu user yêu cầu exploration, trình bày alternatives; nếu chỉ yêu cầu ADR, không tự thêm Implementation Plan dài.

Templates: [Architecture](../../templates/other/architecture-design.md), [ADR](../../templates/other/adr.md).
