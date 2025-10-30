@echo off
chcp 65001 >nul
title TỰ ĐỘNG CẬP NHẬT CODE FE...

echo ============================================
echo 👉 ĐANG CẬP NHẬT CODE FE...
echo ============================================

echo 🔄 Fetching latest changes...
git fetch

echo 🔁 Đang chuyển sang branch master...
git checkout main

echo 📥 Kéo code mới nhất từ GitHub...
git pull origin main

if %errorlevel% neq 0 (
    echo ⚠️ Có lỗi khi cập nhật code. Vui lòng kiểm tra lại!
) else (
    echo ✅ Cập nhật hoàn tất! Nhấn phím bất kỳ để thoát.
)

pause >nul
