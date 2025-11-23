import { validateUsername, validatePassword } from '../utils/validation';

describe('Login Validation Tests', () => {

    // a) Unit tests cho validateUsername() (2 điểm)
    describe('validateUsername', () => {

        test('TC1: Username rỗng - nên trả về lỗi', () => {
            expect(validateUsername('')).toBe(
                'Tên đăng nhập không được để trống'
            );
        });

        test('TC2: Username quá ngắn - nên trả về lỗi', () => {
            expect(validateUsername('ab')).toBe(
                'Tên đăng nhập phải từ 3-50 ký tự'
            );
        });

        test('TC3: Username quá dài - nên trả về lỗi', () => {
            expect(validateUsername('a'.repeat(51))).toBe(
                'Tên đăng nhập phải từ 3-50 ký tự'
            );
        });

        test('TC4: Username có ký tự đặc biệt - không hợp lệ', () => {
            expect(validateUsername('user@123')).toBe(
                'Tên đăng nhập không được chứa ký tự đặc biệt'
            );
        });

        test('TC5: Username hợp lệ - không có lỗi', () => {
            expect(validateUsername('user123')).toBe('');
        });

        test('TC6: Username chỉ có khoảng trắng - nên trả về lỗi', () => {
            expect(validateUsername('   ')).toBe(
                'Tên đăng nhập không được để trống'
            );
        });
    });

    // b) Unit tests cho validatePassword() (2 điểm)
    describe('validatePassword', () => {

        test('TC1: Password rỗng - nên trả về lỗi', () => {
            expect(validatePassword('')).toBe(
                'Mật khẩu không được để trống'
            );
        });

        test('TC2: Password quá ngắn - nên trả về lỗi', () => {
            expect(validatePassword('12345')).toBe(
                'Mật khẩu phải từ 6-100 ký tự'
            );
        });

        test('TC3: Password quá dài - nên trả về lỗi', () => {
            expect(validatePassword('a'.repeat(101))).toBe(
                'Mật khẩu phải từ 6-100 ký tự'
            );
        });

        test('TC4: Password không có chữ - không hợp lệ', () => {
            expect(validatePassword('123456')).toBe(
                'Mật khẩu phải chứa cả chữ và số'
            );
        });

        test('TC5: Password không có số - không hợp lệ', () => {
            expect(validatePassword('abcdef')).toBe(
                'Mật khẩu phải chứa cả chữ và số'
            );
        });

        test('TC6: Password hợp lệ - không có lỗi', () => {
            expect(validatePassword('pass123')).toBe('');
        });

        test('TC7: Password chỉ có khoảng trắng - nên trả về lỗi', () => {
            expect(validatePassword('      ')).toBe(
                'Mật khẩu không được để trống'
            );
        });
    });

});
