let tatCaTacPham = [];

document.addEventListener('DOMContentLoaded', () => {
    khoiTaoTrangChu();
    thietLapSuKienLoc();
});

async function khoiTaoTrangChu() {
    hienThiDangTai();
    try {
        tatCaTacPham = await layDanhSachTacPham();
        hienThiLuoiTacPham(tatCaTacPham);
    } catch (loi) {
        hienThiThongBao('Lỗi', 'Không thể tải danh sách tác phẩm. Vui lòng thử lại sau.', 'error');
        document.getElementById('trangThaiTrong').classList.remove('d-none');
    } finally {
        anDangTai();
    }
}

function hienThiLuoiTacPham(danhSach) {
    const vungChua = document.getElementById('luoiTacPham');
    const trangThaiTrong = document.getElementById('trangThaiTrong');
    
    vungChua.innerHTML = '';
    
    if (danhSach.length === 0) {
        trangThaiTrong.classList.remove('d-none');
        return;
    }
    
    trangThaiTrong.classList.add('d-none');
    
    // Render từng tác phẩm
    danhSach.forEach((tacPham, chiSo) => {
        // Áp dụng animation delay
        const doTre = (chiSo % 10) * 0.1;
        const tenPhongCach = layTenPhongCach(tacPham.style);
        const tieuDe = maHoaHtml(tacPham.title);
        const hoaSi = maHoaHtml(tacPham.artist);
        const nam = maHoaHtml(tacPham.year);
        
        // Kiểm tra trạng thái thích trong localStorage
        const danhSachDaThich = JSON.parse(localStorage.getItem('cacTacPhamDaThich') || '[]');
        const daThich = danhSachDaThich.includes(tacPham.id);
        const classThich = daThich ? 'da-thich bi-heart-fill' : 'bi-heart';
        
        const theHtml = `
            <article class="the-tac-pham" style="animation-delay: ${doTre}s">
                <div class="the-tac-pham-img-wrapper">
                    <img src="${maHoaHtml(tacPham.imageUrl)}" alt="Tác phẩm ${tieuDe} của ${hoaSi}" 
                         onerror="this.onerror=null; this.src='img/placeholder.svg'; this.alt='Ảnh lỗi';">
                    <button class="nut-thich ${daThich ? 'da-thich' : ''}" 
                            onclick="xuLyThich('${tacPham.id}', this)"
                            aria-label="${daThich ? 'Bỏ thích tác phẩm' : 'Thích tác phẩm'}"
                            aria-pressed="${daThich}">
                        <i class="bi ${daThich ? 'bi-heart-fill' : 'bi-heart'}" aria-hidden="true"></i>
                    </button>
                </div>
                <div class="thong-tin-tac-pham">
                    <div class="d-flex justify-content-between align-items-center mb-3 mt-1">
                        <h2 class="tieu-de-tac-pham font-cinzel mb-0">${tieuDe}</h2>
                        <span class="badge text-uppercase">${tenPhongCach}</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <p class="ten-hoa-si mb-0">Bởi <strong>${hoaSi}</strong> <span class="text-secondary ms-2 font-monospace">${nam}</span></p>
                        <span class="luot-thich small text-secondary">
                            <i class="bi bi-heart-fill text-gold me-1" aria-hidden="true"></i> 
                            <span class="so-luot-thich">${tacPham.likes || 0}</span>
                        </span>
                    </div>
                </div>
            </article>
        `;
        
        vungChua.insertAdjacentHTML('beforeend', theHtml);
    });
}

function thietLapSuKienLoc() {
    const cacNutLoc = document.querySelectorAll('#vungLocTacPham .filter-btn');
    
    cacNutLoc.forEach(nut => {
        nut.addEventListener('click', () => {
            // Cập nhật giao diện nút
            // Xóa class active ở tất cả các nút
            cacNutLoc.forEach(n => {
                n.classList.remove('active');
                n.setAttribute('aria-pressed', 'false');
            });
            
            // Thêm class active cho nút được click
            nut.classList.add('active');
            nut.setAttribute('aria-pressed', 'true');
            
            // Lọc dữ liệu
            const phongCachDuocChon = nut.getAttribute('data-phong-cach');
            
            if (phongCachDuocChon === 'TatCa') {
                hienThiLuoiTacPham(tatCaTacPham);
            } else {
                const danhSachLoc = tatCaTacPham.filter(tp => tp.style === phongCachDuocChon);
                hienThiLuoiTacPham(danhSachLoc);
            }
        });
    });
}

async function xuLyThich(idTacPham, nutBam) {
    const theBieuTuong = nutBam.querySelector('i');
    const theSoDem = nutBam.closest('.the-tac-pham').querySelector('.so-luot-thich');
    
    let luotThichHienTai = parseInt(theSoDem.innerText);
    let danhSachDaThich = JSON.parse(localStorage.getItem('cacTacPhamDaThich') || '[]');
    let daThich = danhSachDaThich.includes(idTacPham);
    
    // Tạm thời vô hiệu hóa nút để tránh spam click
    nutBam.disabled = true;
    
    try {
        if (daThich) {
            // Bỏ thích
            luotThichHienTai = Math.max(0, luotThichHienTai - 1);
            danhSachDaThich = danhSachDaThich.filter(id => id !== idTacPham);
            
            theBieuTuong.classList.replace('bi-heart-fill', 'bi-heart');
            nutBam.classList.remove('da-thich');
            nutBam.setAttribute('aria-label', 'Thích tác phẩm');
            nutBam.setAttribute('aria-pressed', 'false');
        } else {
            // Thích
            luotThichHienTai += 1;
            danhSachDaThich.push(idTacPham);
            
            theBieuTuong.classList.replace('bi-heart', 'bi-heart-fill');
            nutBam.classList.add('da-thich');
            nutBam.setAttribute('aria-label', 'Bỏ thích tác phẩm');
            nutBam.setAttribute('aria-pressed', 'true');
        }
        
        // Cập nhật UI ngay lập tức
        theSoDem.innerText = luotThichHienTai;
        localStorage.setItem('cacTacPhamDaThich', JSON.stringify(danhSachDaThich));
        
        // Cập nhật danh sách gốc trong RAM
        const viTri = tatCaTacPham.findIndex(tp => tp.id === idTacPham);
        if (viTri !== -1) tatCaTacPham[viTri].likes = luotThichHienTai;
        
        // Gửi AJAX PUT lên server (chạy ngầm)
        await capNhatLuotThich(idTacPham, luotThichHienTai);
        
    } catch (loi) {
        hienThiThongBao('Lỗi', 'Không thể cập nhật lượt thích.', 'error');
        // Hoàn tác UI nếu lỗi
    } finally {
        nutBam.disabled = false;
    }
}
