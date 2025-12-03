// Nhập (import) file commands.js sử dụng cú pháp ES2015
import './commands';

// Hoặc bạn có thể dùng cú pháp CommonJS thay thế:
// require('./commands')

// Ẩn các request fetch/XHR trong bảng ghi log của Cypress
const app = window.top;

// Kiểm tra xem style đã được thêm chưa để tránh thêm nhiều lần
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
  // Tạo thẻ style mới
  const style = app.document.createElement('style');

  // Nội dung CSS để ẩn các dòng log liên quan tới request và xhr
  style.innerHTML =
    '.command-name-request, .command-name-xhr { display: none }';

  // Thêm thuộc tính đánh dấu đã thêm style này rồi
  style.setAttribute('data-hide-command-log-request', '');

  // Thêm thẻ style vào phần <head> của trang
  app.document.head.appendChild(style);
}
