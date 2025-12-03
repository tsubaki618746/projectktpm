# Project Kiểm Thử Phần Mềm (KTPM)

Đây là một dự án full-stack để học tập và thực hành các phương pháp kiểm thử phần mềm, bao gồm Unit Testing, Integration Testing, Mock Testing, và End-to-End Testing.

## Mô tả dự án

Project này bao gồm:
- Backend API được xây dựng với Java Spring Boot
- Frontend được xây dựng với React + Vite
- Database sử dụng H2 (mặc định) hoặc MySQL
- Các loại test: Unit Tests, Integration Tests, Mock Tests, E2E Tests, Security Tests

## Yêu cầu hệ thống

Trước khi chạy dự án, hãy chuẩn bị:

- Java 17 trở lên
- Node.js 16+ và npm
- NetBeans IDE (cho backend)
- VS Code hoặc editor khác (cho frontend)
- MySQL (tuỳ chọn, nếu muốn dùng thay H2)

## Cài đặt

### Backend - Cài đặt dependencies

```
cd backend
mvn clean install
```

### Frontend - Cài đặt dependencies

```
cd fontend
npm install
```

## Chạy ứng dụng

### Cách 1: Chạy Backend trên NetBeans (Khuyến khích)

1. Mở NetBeans IDE
2. Chọn File > Open Project
3. Điều hướng đến thư mục `backend` của dự án
4. Click Open
5. Cấu hình Maven:
   - Chuột phải lên project > Properties
   - Chọn Run
   - Set Main Class: com.flogin.BackendApplication (nếu cần)
6. Chạy project:
   - Chuột phải lên project > Run (hoặc Ctrl+F6)
   - Hoặc Click Run > Run Project từ menu
7. Backend sẽ chạy tại: http://localhost:8080

Để xem H2 Console (database UI):
- Truy cập: http://localhost:8080/h2-console
- Nhập JDBC URL: jdbc:h2:file:./data/testdb
- Username: sa
- Password: (để trống)

### Cách 2: Chạy Frontend

Mở terminal mới và chạy:

```
cd fontend
npm run dev
```

Frontend sẽ chạy tại: http://localhost:3000

### Cách 3: Chạy toàn bộ (Backend + Frontend)

Terminal 1 - Chạy Backend trên NetBeans (như hướng dẫn Cách 1)

Terminal 2 - Chạy Frontend:
```
cd fontend
npm run dev
```

Sau đó mở trình duyệt:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api

## Database

Project hỗ trợ 2 loại database:

### H2 (Mặc định - Phát triển)

File cấu hình: `backend/src/main/resources/application.properties`

```
spring.datasource.url=jdbc:h2:file:./data/testdb
spring.datasource.username=sa
spring.datasource.password=
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

Dữ liệu test được tạo tự động khi ứng dụng khởi động.

### MySQL (Production)

File cấu hình: `backend/src/main/resources/application-mysql.properties`

```
spring.datasource.url=jdbc:mysql://localhost:3306/testdb?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

Để sử dụng MySQL:
1. Sửa file `application.properties` hoặc chọn profile `mysql`
2. Cập nhật thông tin kết nối (username, password)
3. Chạy lại backend

## Chạy Tests

### Backend - Unit Tests & Integration Tests

```
cd backend
mvn test
```

Chạy test cụ thể:
```
mvn test -Dtest=AuthServiceTest
mvn test -Dtest=ProductServiceTest
```

Chạy test với coverage report:
```
mvn clean verify
```

Test coverage report sẽ nằm tại: `backend/target/site/jacoco/index.html`

### Frontend - Unit Tests & Integration Tests

```
cd fontend
npm test
```

Chạy test với coverage:
```
npm run test:coverage
```

### Frontend - E2E Tests (Cypress)

Mở Cypress UI (interactive mode - để xem từng step):
```
npm run cypress:open
```

Chạy tất cả E2E tests tự động:
```
npm run cypress:run
```

Chạy chỉ test login:
```
npm run cypress:run:login
```

Yêu cầu: Backend và Frontend phải chạy trước khi chạy E2E tests

```
# Terminal 1: Backend (chạy trên NetBeans hoặc terminal)
cd backend && mvn spring-boot:run

# Terminal 2: Frontend
cd fontend && npm run dev

# Terminal 3: Cypress tests
cd fontend && npm run cypress:open
```

## Cấu trúc dự án

```
projectktpm/
├── backend/                          Java Spring Boot Backend
│   ├── src/
│   │   ├── main/java/com/flogin/
│   │   │   ├── controller/           API Controllers
│   │   │   ├── service/              Business Logic
│   │   │   ├── entity/               JPA Entities
│   │   │   ├── repository/           Data Access Layer
│   │   │   ├── dto/                  Data Transfer Objects
│   │   │   └── config/               Configuration
│   │   ├── test/java/com/flogin/     Unit & Integration Tests
│   │   └── resources/
│   │       ├── application.properties        H2 Config
│   │       └── application-mysql.properties  MySQL Config
│   ├── pom.xml                       Maven Dependencies
│   └── mvnw, mvnw.cmd                Maven Wrapper
├── fontend/                          React + Vite Frontend
│   ├── src/
│   │   ├── components/               React Components
│   │   ├── pages/                    Page Components
│   │   ├── services/                 API Services
│   │   ├── utils/                    Utilities & Validators
│   │   └── tests/                    Unit & Integration Tests
│   ├── cypress/                      E2E Tests
│   │   ├── e2e/                      Test Files
│   │   ├── fixtures/                 Test Data
│   │   ├── support/                  Custom Commands & Page Objects
│   │   └── pages/                    Page Object Models
│   ├── package.json
│   ├── vite.config.js
│   ├── jest.config.js
│   └── cypress.config.js
└── README.md
```

## API Endpoints

### Authentication
- POST `/api/auth/login` - Đăng nhập
- Response: `{ success: boolean, message: string, token: string }`

### Products
- GET `/api/products?page=0&size=10` - Lấy danh sách sản phẩm
- GET `/api/products/{id}` - Lấy chi tiết sản phẩm
- POST `/api/products` - Thêm sản phẩm mới
- PUT `/api/products/{id}` - Cập nhật sản phẩm
- DELETE `/api/products/{id}` - Xóa sản phẩm

## Các loại test trong dự án

### Backend Tests

1. Unit Tests - Kiểm tra từng method riêng lẻ
   - AuthServiceTest.java
   - ProductServiceTest.java

2. Integration Tests - Kiểm tra toàn bộ flow từ controller -> service -> repository
   - AuthControllerIntegrationTest.java
   - ProductControllerIntegrationTest.java

3. Mock Tests - Mock dependencies để test isolated
   - AuthControllerMockTest.java
   - ProductServiceMockTest.java

### Frontend Tests

1. Unit Tests - Kiểm tra từng component
   - Login.mock.test.js
   - Product.mock.test.js

2. Integration Tests - Kiểm tra component + service
   - Login.integration.test.js
   - ProductList.integration.test.js

3. E2E Tests - Kiểm tra toàn bộ user flow
   - login.e2e.spec.js - Test login flow
   - product.e2e.spec.js - Test product CRUD
   - security/sql-injection-login.spec.js - Test SQL injection attacks

## Troubleshooting

### Backend không khởi động được

1. Kiểm tra Java version:
   ```
   java -version
   ```
   Phải là Java 17 trở lên

2. Kiểm tra port 8080 đã được sử dụng:
   ```
   netstat -an | findstr 8080
   ```
   Nếu port đã dùng, thay đổi port trong `application.properties`

3. Xóa cache Maven:
   ```
   cd backend
   mvn clean install
   ```

### Frontend không chạy được

1. Kiểm tra Node.js version:
   ```
   node -v
   npm -v
   ```

2. Xóa node_modules và cài lại:
   ```
   cd fontend
   rm -r node_modules
   npm install
   ```

3. Kiểm tra port 3000:
   ```
   netstat -an | findstr 3000
   ```

### E2E tests fail

1. Kiểm tra backend chạy tại http://localhost:8080
2. Kiểm tra frontend chạy tại http://localhost:3000
3. Đảm bảo các element có `data-testid` trong HTML
4. Xem screenshot trong `fontend/cypress/screenshots/` để debug

## Các công cụ và thư viện

### Backend
- Spring Boot 3.5.7
- JUnit 5
- Mockito
- JaCoCo (Code Coverage)
- H2 Database
- MySQL Connector

### Frontend
- React 18
- Vite
- Jest
- React Testing Library
- Cypress
- React Router

## Ghi chú

- Dữ liệu test được tạo tự động khi backend khởi động
- Mỗi lần chạy test, database sẽ được reset (tuỳ thuộc vào configuration)
- Sử dụng `data-testid` cho các selector Cypress thay vì class/id
- Kiểm tra coverage report để đảm bảo test đủ code

## Hỗ trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. Console log của backend (NetBeans Output)
2. Console log của frontend (Terminal / Browser DevTools)
3. Test report tại `backend/target/surefire-reports/`
4. Screenshots/Videos tại `fontend/cypress/screenshots/` hoặc `videos/`

## Tác giả

Project kiểm thử phần mềm cho mục đích học tập
