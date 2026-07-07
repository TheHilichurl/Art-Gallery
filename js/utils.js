// Hàm tiện ích hiển thị loading
function hienThiDangTai() {
    document.getElementById('manHinhCho').classList.remove('d-none');
}

function anDangTai() {
    document.getElementById('manHinhCho').classList.add('d-none');
}

// Hàm tiện ích hiển thị Toast Notification
function hienThiThongBao(tieuDe, noiDung, loai = 'success') {
    const vungThongBao = document.getElementById('vungThongBao');
    const thoiGian = new Date().toLocaleTimeString('vi-VN');
    
    // Chọn icon và màu sắc theo loại
    let icon = 'bi-check-circle-fill text-success';
    let mauVien = 'border-success';
    
    if (loai === 'error') {
        icon = 'bi-x-circle-fill text-danger';
        mauVien = 'border-danger';
    } else if (loai === 'info') {
        icon = 'bi-info-circle-fill text-info';
        mauVien = 'border-info';
    }

    const htmlToast = `
        <div class="toast ${mauVien} bg-dark text-light show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header bg-dark text-light border-bottom border-secondary">
                <i class="bi ${icon} me-2" aria-hidden="true"></i>
                <strong class="me-auto">${tieuDe}</strong>
                <small class="text-secondary">${thoiGian}</small>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Đóng"></button>
            </div>
            <div class="toast-body">
                ${noiDung}
            </div>
        </div>
    `;

    // Tạo phần tử tạm
    const theTam = document.createElement('div');
    theTam.innerHTML = htmlToast;
    const theToast = theTam.firstElementChild;
    
    vungThongBao.appendChild(theToast);

    // Tự động ẩn sau 3 giây
    setTimeout(() => {
        theToast.classList.remove('show');
        setTimeout(() => theToast.remove(), 300); // Đợi animation kết thúc
    }, 3000);
}

// Chuyển mã phong cách thành text hiển thị
function layTenPhongCach(maPhongCach) {
    const danhSach = {
        'HienDai': 'Hiện Đại',
        'CoDien': 'Cổ Điển',
        'TruuTuong': 'Trừu Tượng'
    };
    return danhSach[maPhongCach] || maPhongCach;
}

// Escape HTML chống XSS
function maHoaHtml(chuoi) {
    if (!chuoi) return '';
    const theDiv = document.createElement('div');
    theDiv.innerText = chuoi;
    return theDiv.innerHTML;
}
