const MAT_KHAU_QUAN_TRI = 'admin123';
let hopThoaiDangNhap = null;
let hopThoaiTacPham = null;
let hopThoaiXoa = null;
let danhSachQuanTri = [];

document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo các Modal Bootstrap
    hopThoaiDangNhap = new bootstrap.Modal(document.getElementById('hopThoaiDangNhap'));
    hopThoaiTacPham = new bootstrap.Modal(document.getElementById('hopThoaiTacPham'));
    hopThoaiXoa = new bootstrap.Modal(document.getElementById('hopThoaiXoa'));
    
    kiemTraDangNhap();
    
    // Sự kiện submit form đăng nhập
    document.getElementById('bieuMauDangNhap').addEventListener('submit', xuLyDangNhap);
    
    // Sự kiện submit form thêm/sửa tác phẩm
    document.getElementById('bieuMauTacPham').addEventListener('submit', xuLyLuuTacPham);

    // Lắng nghe thay đổi vai trò đăng nhập để ẩn/hiện mật khẩu
    document.querySelectorAll('input[name="vaiTro"]').forEach(el => {
        el.addEventListener('change', (e) => {
            const vungMatKhau = document.getElementById('vungMatKhau');
            const matKhauInput = document.getElementById('matKhau');
            if (e.target.value === 'khach') {
                vungMatKhau.classList.add('d-none');
                matKhauInput.removeAttribute('required');
            } else {
                vungMatKhau.classList.remove('d-none');
                matKhauInput.setAttribute('required', 'required');
            }
        });
    });
});

function kiemTraDangNhap() {
    const daDangNhap = sessionStorage.getItem('daDangNhapAdmin');
    if (daDangNhap === 'true') {
        hienThiGiaoDienQuanTri();
    } else {
        hopThoaiDangNhap.show();
    }
}

function xuLyDangNhap(suKien) {
    suKien.preventDefault();
    const theMatKhau = document.getElementById('matKhau');
    const matKhauNhap = theMatKhau.value;
    
    const vaiTro = document.querySelector('input[name="vaiTro"]:checked').value;
    
    if (vaiTro === 'khach') {
        sessionStorage.setItem('daDangNhapAdmin', 'true');
        sessionStorage.setItem('vaiTroNguoiDung', 'khach');
        hopThoaiDangNhap.hide();
        hienThiThongBao('Thành công', 'Đăng nhập vai trò Khách hàng thành công!');
        hienThiGiaoDienQuanTri();
    } else {
        if (matKhauNhap === MAT_KHAU_QUAN_TRI) {
            theMatKhau.classList.remove('is-invalid');
            sessionStorage.setItem('daDangNhapAdmin', 'true');
            sessionStorage.setItem('vaiTroNguoiDung', 'admin');
            hopThoaiDangNhap.hide();
            hienThiThongBao('Thành công', 'Đăng nhập vai trò Admin thành công!');
            hienThiGiaoDienQuanTri();
        } else {
            theMatKhau.classList.add('is-invalid');
        }
    }
}

async function hienThiGiaoDienQuanTri() {
    const vaiTro = sessionStorage.getItem('vaiTroNguoiDung') || 'admin';
    const theNhan = document.getElementById('nhanVaiTro');
    const theNutThem = document.getElementById('nutThemTacPham');
    
    if (vaiTro === 'khach') {
        if (theNhan) {
            theNhan.innerText = 'Khách Hàng';
            theNhan.className = 'badge bg-secondary bg-opacity-25 text-info border border-info border-opacity-50 px-3 py-2 font-cinzel';
        }
        if (theNutThem) theNutThem.classList.add('d-none');
    } else {
        if (theNhan) {
            theNhan.innerText = 'Quản Trị Viên';
            theNhan.className = 'badge bg-secondary bg-opacity-25 text-gold border border-gold border-opacity-50 px-3 py-2 font-cinzel';
        }
        if (theNutThem) theNutThem.classList.remove('d-none');
    }
    
    document.getElementById('vungQuanTri').classList.remove('d-none');
    taiDanhSachTacPham();
}

async function taiDanhSachTacPham() {
    hienThiDangTai();
    try {
        danhSachQuanTri = await layDanhSachTacPham();
        renderBangTacPham(danhSachQuanTri);
    } catch (loi) {
        hienThiThongBao('Lỗi', 'Không tải được dữ liệu.', 'error');
    } finally {
        anDangTai();
    }
}

function renderBangTacPham(danhSach) {
    const vungBang = document.getElementById('bangTacPham');
    vungBang.innerHTML = '';
    
    if (danhSach.length === 0) {
        vungBang.innerHTML = `<tr><td colspan="7" class="text-center py-4">Chưa có tác phẩm nào.</td></tr>`;
        return;
    }
    
    const vaiTro = sessionStorage.getItem('vaiTroNguoiDung') || 'admin';
    
    danhSach.forEach(tp => {
        const theHtml = `
            <tr>
                <td>
                    <img src="${maHoaHtml(tp.imageUrl)}" alt="${maHoaHtml(tp.title)}" class="anh-thu-nho"
                         onerror="this.onerror=null; this.src='img/placeholder.svg';">
                </td>
                <td class="fw-bold">${maHoaHtml(tp.title)}</td>
                <td>${maHoaHtml(tp.artist)}</td>
                <td>${maHoaHtml(tp.year)}</td>
                <td><span class="badge bg-secondary">${layTenPhongCach(tp.style)}</span></td>
                <td class="text-center">${tp.likes || 0}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-info me-1" onclick="chuanBiSuaTacPham('${tp.id}')" aria-label="Sửa tác phẩm">
                        <i class="bi bi-pencil" aria-hidden="true"></i>
                    </button>
                    ${vaiTro === 'admin' ? `
                    <button class="btn btn-sm btn-outline-danger" onclick="xacNhanXoa('${tp.id}')" aria-label="Xóa tác phẩm">
                        <i class="bi bi-trash" aria-hidden="true"></i>
                    </button>
                    ` : ''}
                </td>
            </tr>
        `;
        vungBang.insertAdjacentHTML('beforeend', theHtml);
    });
}

function xemTruocAnh(url) {
    const theAnh = document.getElementById('anhXemTruoc');
    const theChuThich = document.getElementById('chuThichAnhXemTruoc');
    
    if (url) {
        theAnh.src = url;
        theAnh.onerror = function() {
            this.onerror = null;
            this.src = 'img/placeholder.svg';
        };
        theAnh.classList.remove('d-none');
        theChuThich.classList.add('d-none');
    } else {
        theAnh.classList.add('d-none');
        theChuThich.classList.remove('d-none');
    }
}

function chuanBiThemTacPham() {
    const bieuMau = document.getElementById('bieuMauTacPham');
    bieuMau.reset();
    bieuMau.classList.remove('was-validated');
    
    document.getElementById('idTacPham').value = '';
    document.getElementById('tieuDeHopThoai').innerText = 'Thêm Tác Phẩm';
    xemTruocAnh('');
}

function chuanBiSuaTacPham(id) {
    const tacPham = danhSachQuanTri.find(tp => tp.id === id);
    if (!tacPham) return;
    
    const bieuMau = document.getElementById('bieuMauTacPham');
    bieuMau.reset();
    bieuMau.classList.remove('was-validated');
    
    document.getElementById('idTacPham').value = tacPham.id;
    document.getElementById('tenTacPham').value = tacPham.title;
    document.getElementById('tenHoaSi').value = tacPham.artist;
    document.getElementById('namSangTac').value = tacPham.year;
    document.getElementById('phongCach').value = tacPham.style;
    document.getElementById('moTa').value = tacPham.description;
    document.getElementById('duongDanAnh').value = tacPham.imageUrl;
    
    document.getElementById('tieuDeHopThoai').innerText = 'Cập Nhật Tác Phẩm';
    xemTruocAnh(tacPham.imageUrl);
    
    hopThoaiTacPham.show();
}

async function xuLyLuuTacPham(suKien) {
    suKien.preventDefault();
    const bieuMau = document.getElementById('bieuMauTacPham');
    
    if (!bieuMau.checkValidity()) {
        suKien.stopPropagation();
        bieuMau.classList.add('was-validated');
        return;
    }
    
    const id = document.getElementById('idTacPham').value;
    const duLieu = {
        title: document.getElementById('tenTacPham').value,
        artist: document.getElementById('tenHoaSi').value,
        year: parseInt(document.getElementById('namSangTac').value),
        style: document.getElementById('phongCach').value,
        description: document.getElementById('moTa').value,
        imageUrl: document.getElementById('duongDanAnh').value
    };
    
    // Vô hiệu hóa nút lưu
    const nutLuu = document.getElementById('nutLuuTacPham');
    const noiDungNutCu = nutLuu.innerHTML;
    nutLuu.disabled = true;
    nutLuu.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang lưu...';
    
    try {
        if (id) {
            // Cập nhật
            await capNhatTacPham(id, duLieu);
            hienThiThongBao('Thành công', 'Đã cập nhật tác phẩm!');
        } else {
            // Thêm mới (khởi tạo likes = 0)
            duLieu.likes = 0;
            await taoTacPham(duLieu);
            hienThiThongBao('Thành công', 'Đã thêm tác phẩm mới!');
        }
        
        hopThoaiTacPham.hide();
        await taiDanhSachTacPham();
    } catch (loi) {
        hienThiThongBao('Lỗi', 'Không thể lưu tác phẩm.', 'error');
    } finally {
        nutLuu.disabled = false;
        nutLuu.innerHTML = noiDungNutCu;
    }
}

function xacNhanXoa(id) {
    document.getElementById('idXoa').value = id;
    hopThoaiXoa.show();
}

async function thucHienXoaTacPham() {
    const id = document.getElementById('idXoa').value;
    hopThoaiXoa.hide();
    hienThiDangTai();
    
    try {
        await xoaTacPhamAPI(id);
        hienThiThongBao('Thành công', 'Đã xóa tác phẩm.');
        await taiDanhSachTacPham();
    } catch (loi) {
        hienThiThongBao('Lỗi', 'Không thể xóa tác phẩm.', 'error');
    } finally {
        anDangTai();
    }
}

function dangXuat() {
    sessionStorage.removeItem('daDangNhapAdmin');
    sessionStorage.removeItem('vaiTroNguoiDung');
    location.reload();
}
