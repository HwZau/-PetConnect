# Contributing to Pet Connect Frontend

## Branch Protection Policy

🚫 **KHÔNG được push trực tiếp lên nhánh `main`**

## Quy trình làm việc

### 1. Tạo feature branch

```bash
git checkout -b feature/ten-tinh-nang
# hoặc
git checkout -b fix/ten-bug
```

### 2. Làm việc trên branch của bạn

```bash
# Thực hiện thay đổi
git add .
git commit -m "feat: mô tả thay đổi"
```

### 3. Push branch lên GitHub

```bash
git push -u origin feature/ten-tinh-nang
```

### 4. Tạo Pull Request

- Vào GitHub repository
- Click "Compare & pull request"
- Điền mô tả chi tiết về thay đổi
- Assign reviewer
- Chờ review và approval

### 5. Merge sau khi được approve

- Chỉ merge sau khi có ít nhất 1 approval
- Sử dụng "Squash and merge" để giữ history sạch

## Naming Convention

### Branch names:

- `feature/ten-tinh-nang` - cho tính năng mới
- `fix/ten-bug` - cho bug fix
- `docs/ten-tai-lieu` - cho cập nhật tài liệu
- `refactor/ten-phan` - cho refactoring

### Commit messages:

- `feat:` - tính năng mới
- `fix:` - sửa bug
- `docs:` - cập nhật tài liệu
- `style:` - thay đổi styling
- `refactor:` - refactoring code
- `test:` - thêm test

## Code Review Checklist

- [ ] Code chạy được và không có lỗi
- [ ] Có comment/documentation cần thiết
- [ ] Follow coding standards
- [ ] Responsive design (nếu có UI changes)
- [ ] Test trên multiple browsers
- [ ] Performance tốt

## Emergency Hotfix

Trong trường hợp khẩn cấp, liên hệ admin để được push trực tiếp lên main.
