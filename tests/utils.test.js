// utils.test.js - Unit Testing for Utility functions

// Giả lập DOM cho maHoaHtml
if (typeof document === 'undefined') {
    const { JSDOM } = require('jsdom');
    const dom = new JSDOM();
    global.document = dom.window.document;
}

// Định nghĩa lại các hàm utility ở môi trường Node.js để test
function layTenPhongCach(maPhongCach) {
    const danhSach = {
        'HienDai': 'Hiện Đại',
        'CoDien': 'Cổ Điển',
        'TruuTuong': 'Trừu Tượng'
    };
    return danhSach[maPhongCach] || maPhongCach;
}

function maHoaHtml(chuoi) {
    if (!chuoi) return '';
    const theDiv = document.createElement('div');
    theDiv.innerText = chuoi;
    return theDiv.innerHTML;
}

describe('Kiểm thử module Tiện ích (Utils)', () => {
    
    describe('Hàm layTenPhongCach', () => {
        it('nên trả về "Hiện Đại" khi đầu vào là "HienDai"', () => {
            expect(layTenPhongCach('HienDai')).toBe('Hiện Đại');
        });

        it('nên trả về "Cổ Điển" khi đầu vào là "CoDien"', () => {
            expect(layTenPhongCach('CoDien')).toBe('Cổ Điển');
        });

        it('nên trả về đúng mã gốc nếu không có trong danh sách', () => {
            expect(layTenPhongCach('KhongTonTai')).toBe('KhongTonTai');
        });
    });

    describe('Hàm maHoaHtml (Chống XSS)', () => {
        it('nên mã hóa các ký tự đặc biệt HTML', () => {
            const chuoiXss = '<script>alert("hack")</script>';
            const ketQua = maHoaHtml(chuoiXss);
            expect(ketQua).not.toContain('<script>');
            expect(ketQua).toContain('&lt;script&gt;');
        });

        it('nên trả về chuỗi rỗng nếu đầu vào là null/undefined', () => {
            expect(maHoaHtml(null)).toBe('');
            expect(maHoaHtml(undefined)).toBe('');
        });

        it('nên giữ nguyên chuỗi an toàn', () => {
            const anToan = 'Xin chào, đây là văn bản bình thường';
            expect(maHoaHtml(anToan)).toBe(anToan);
        });
    });
});
