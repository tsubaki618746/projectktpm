// Security Testing - SQL Injection for Login
// Test common SQL injection attacks on login form

describe('SQL Injection Tests - Login', () => {
    
    beforeEach(() => {
        cy.visit('/');
    });

    // ========================================
    // 1. Basic SQL Injection Attempts
    // ========================================

    it('TC1: Nên chặn SQL injection với OR 1=1 trong username', () => {
        cy.get('[data-testid="username-input"]').type("admin' OR '1'='1");
        cy.get('[data-testid="password-input"]').type('anything');
        cy.get('[data-testid="login-button"]').click();

        // Không được login thành công
        cy.url().should('not.include', '/dashboard');
        cy.url().should('not.include', '/products');
        
        // Phải hiển thị lỗi
        cy.get('[data-testid="login-message"]')
            .should('contain', 'Invalid credentials');
    });

    it('TC2: Nên chặn SQL injection với OR 1=1 trong password', () => {
        cy.get('[data-testid="username-input"]').type('testuser');
        cy.get('[data-testid="password-input"]').type("' OR '1'='1");
        cy.get('[data-testid="login-button"]').click();

        cy.url().should('not.include', '/dashboard');
        cy.get('[data-testid="login-message"]')
            .should('contain', 'Invalid credentials');
    });

    it('TC3: Nên chặn SQL injection với OR 1=1 trong cả username và password', () => {
        cy.get('[data-testid="username-input"]').type("admin' OR '1'='1");
        cy.get('[data-testid="password-input"]').type("' OR '1'='1");
        cy.get('[data-testid="login-button"]').click();

        cy.url().should('not.include', '/dashboard');
        cy.get('[data-testid="login-message"]')
            .should('contain', 'Invalid credentials');
    });

    // ========================================
    // 2. Comment-based SQL Injection
    // ========================================

    it('TC4: Nên chặn SQL injection với comment -- trong username', () => {
        cy.get('[data-testid="username-input"]').type("admin'--");
        cy.get('[data-testid="password-input"]').type('anything');
        cy.get('[data-testid="login-button"]').click();

        cy.url().should('not.include', '/dashboard');
        cy.get('[data-testid="login-message"]')
            .should('contain', 'Invalid credentials');
    });

    it('TC5: Nên chặn SQL injection với comment /* */ trong username', () => {
        cy.get('[data-testid="username-input"]').type("admin'/*");
        cy.get('[data-testid="password-input"]').type('anything');
        cy.get('[data-testid="login-button"]').click();

        cy.url().should('not.include', '/dashboard');
        cy.get('[data-testid="login-message"]')
            .should('contain', 'Invalid credentials');
    });

    it('TC6: Nên chặn SQL injection với # comment trong username', () => {
        cy.get('[data-testid="username-input"]').type("admin'#");
        cy.get('[data-testid="password-input"]').type('anything');
        cy.get('[data-testid="login-button"]').click();

        cy.url().should('not.include', '/dashboard');
        cy.get('[data-testid="login-message"]')
            .should('contain', 'Invalid credentials');
    });

    // ========================================
    // 3. UNION-based SQL Injection
    // ========================================

    it('TC7: Nên chặn UNION SELECT injection trong username', () => {
        cy.get('[data-testid="username-input"]')
            .type("admin' UNION SELECT NULL, NULL, NULL--");
        cy.get('[data-testid="password-input"]').type('anything');
        cy.get('[data-testid="login-button"]').click();

        cy.url().should('not.include', '/dashboard');
        cy.get('[data-testid="login-message"]')
            .should('contain', 'Invalid credentials');
    });

    it('TC8: Nên chặn UNION SELECT với password extraction', () => {
        cy.get('[data-testid="username-input"]')
            .type("admin' UNION SELECT username, password FROM users--");
        cy.get('[data-testid="password-input"]').type('anything');
        cy.get('[data-testid="login-button"]').click();

        cy.url().should('not.include', '/dashboard');
        cy.get('[data-testid="login-message"]')
            .should('contain', 'Invalid credentials');
    });

    // ========================================
    // 4. Time-based Blind SQL Injection
    // ========================================

    it('TC9: Nên chặn time-based SQL injection với SLEEP', () => {
        const startTime = Date.now();
        
        cy.get('[data-testid="username-input"]')
            .type("admin' AND SLEEP(5)--");
        cy.get('[data-testid="password-input"]').type('anything');
        cy.get('[data-testid="login-button"]').click();

        cy.url().should('not.include', '/dashboard');
        
        // Response không nên bị delay 5 giây
        cy.then(() => {
            const endTime = Date.now();
            const duration = endTime - startTime;
            expect(duration).to.be.lessThan(5000);
        });
    });

    it('TC10: Nên chặn time-based SQL injection với WAITFOR', () => {
        cy.get('[data-testid="username-input"]')
            .type("admin'; WAITFOR DELAY '00:00:05'--");
        cy.get('[data-testid="password-input"]').type('anything');
        cy.get('[data-testid="login-button"]').click();

        cy.url().should('not.include', '/dashboard');
        cy.get('[data-testid="login-message"]')
            .should('contain', 'Invalid credentials');
    });

    // ========================================
    // 5. Stacked Queries SQL Injection
    // ========================================

    it('TC11: Nên chặn stacked queries với DROP TABLE', () => {
        cy.get('[data-testid="username-input"]')
            .type("admin'; DROP TABLE users--");
        cy.get('[data-testid="password-input"]').type('anything');
        cy.get('[data-testid="login-button"]').click();

        cy.url().should('not.include', '/dashboard');
        cy.get('[data-testid="login-message"]')
            .should('contain', 'Invalid credentials');
        
        // Kiểm tra hệ thống vẫn hoạt động (table không bị xóa)
        cy.visit('/');
        cy.get('[data-testid="username-input"]').should('be.visible');
    });

    it('TC12: Nên chặn stacked queries với INSERT', () => {
        cy.get('[data-testid="username-input"]')
            .type("admin'; INSERT INTO users VALUES('hacker','hacked')--");
        cy.get('[data-testid="password-input"]').type('anything');
        cy.get('[data-testid="login-button"]').click();

        cy.url().should('not.include', '/dashboard');
        cy.get('[data-testid="login-message"]')
            .should('contain', 'Invalid credentials');
    });

    // ========================================
    // 6. Boolean-based Blind SQL Injection
    // ========================================

    it('TC13: Nên chặn boolean-based blind SQL injection', () => {
        cy.get('[data-testid="username-input"]')
            .type("admin' AND 1=1--");
        cy.get('[data-testid="password-input"]').type('anything');
        cy.get('[data-testid="login-button"]').click();

        cy.url().should('not.include', '/dashboard');
        cy.get('[data-testid="login-message"]')
            .should('contain', 'Invalid credentials');
    });

    it('TC14: Nên chặn boolean-based với substring extraction', () => {
        cy.get('[data-testid="username-input"]')
            .type("admin' AND SUBSTRING((SELECT password FROM users LIMIT 1),1,1)='a'--");
        cy.get('[data-testid="password-input"]').type('anything');
        cy.get('[data-testid="login-button"]').click();

        cy.url().should('not.include', '/dashboard');
        cy.get('[data-testid="login-message"]')
            .should('contain', 'Invalid credentials');
    });

    // ========================================
    // 7. Special Characters & Encoding
    // ========================================

    it('TC15: Nên chặn SQL injection với hex encoding', () => {
        cy.get('[data-testid="username-input"]')
            .type("admin' OR 0x61646D696E--");
        cy.get('[data-testid="password-input"]').type('anything');
        cy.get('[data-testid="login-button"]').click();

        cy.url().should('not.include', '/dashboard');
        cy.get('[data-testid="login-message"]')
            .should('contain', 'Invalid credentials');
    });

    it('TC16: Nên chặn SQL injection với URL encoding', () => {
        cy.get('[data-testid="username-input"]')
            .type("admin%27%20OR%20%271%27%3D%271");
        cy.get('[data-testid="password-input"]').type('anything');
        cy.get('[data-testid="login-button"]').click();

        cy.url().should('not.include', '/dashboard');
        cy.get('[data-testid="login-message"]')
            .should('contain', 'Invalid credentials');
    });

    // ========================================
    // 8. Database-specific Injection
    // ========================================

    it('TC17: Nên chặn MySQL-specific injection với CONCAT', () => {
        cy.get('[data-testid="username-input"]')
            .type("admin' OR 1=1 LIMIT 1--");
        cy.get('[data-testid="password-input"]').type('anything');
        cy.get('[data-testid="login-button"]').click();

        cy.url().should('not.include', '/dashboard');
        cy.get('[data-testid="login-message"]')
            .should('contain', 'Invalid credentials');
    });

    it('TC18: Nên chặn PostgreSQL-specific injection', () => {
        cy.get('[data-testid="username-input"]')
            .type("admin' OR 1=1 OFFSET 0--");
        cy.get('[data-testid="password-input"]').type('anything');
        cy.get('[data-testid="login-button"]').click();

        cy.url().should('not.include', '/dashboard');
        cy.get('[data-testid="login-message"]')
            .should('contain', 'Invalid credentials');
    });

    // ========================================
    // 9. Error-based SQL Injection
    // ========================================

    it('TC19: Nên không leak database errors với invalid syntax', () => {
        cy.get('[data-testid="username-input"]').type("admin'''");
        cy.get('[data-testid="password-input"]').type('anything');
        cy.get('[data-testid="login-button"]').click();

        // Không được hiển thị SQL error messages
        cy.get('body').should('not.contain', 'SQL');
        cy.get('body').should('not.contain', 'syntax error');
        cy.get('body').should('not.contain', 'mysql');
        cy.get('body').should('not.contain', 'postgresql');
        
        // Chỉ hiển thị generic error
        cy.get('[data-testid="login-message"]')
            .should('contain', 'Invalid credentials');
    });

    it('TC20: Nên không leak database structure information', () => {
        cy.get('[data-testid="username-input"]')
            .type("admin' AND (SELECT COUNT(*) FROM information_schema.tables)>0--");
        cy.get('[data-testid="password-input"]').type('anything');
        cy.get('[data-testid="login-button"]').click();

        cy.get('body').should('not.contain', 'information_schema');
        cy.get('body').should('not.contain', 'table');
        cy.get('body').should('not.contain', 'column');
    });
});
