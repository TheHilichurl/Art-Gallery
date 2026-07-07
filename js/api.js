// URL MockAPI - Thay bằng URL thật của bạn để chạy ứng dụng
const URL_CO_SO = 'https://6a13e82a6c7db8aac0538233.mockapi.io/ArtGallery';

// Xử lý chung cho fetch
async function goiApi(url, tuyChon = {}) {
    try {
        const phanHoi = await fetch(url, tuyChon);
        if (!phanHoi.ok) {
            throw new Error(`Lỗi HTTP: ${phanHoi.status}`);
        }
        return await phanHoi.json();
    } catch (loi) {
        console.error("Lỗi gọi API:", loi);
        throw loi;
    }
}

// Lấy danh sách tất cả tác phẩm
async function layDanhSachTacPham() {
    let duLieuApi = [];
    try {
        const data = await goiApi(URL_CO_SO);
        if (Array.isArray(data)) {
            duLieuApi = data;
        }
    } catch (e) {
        console.warn("API lỗi, chỉ sử dụng dữ liệu dự phòng...");
    }
    
    // Gộp dữ liệu kiệt tác vào dữ liệu API (kiệt tác hiện lên trước)
    return [...duLieuApi];
}

// Thêm tác phẩm mới
async function taoTacPham(duLieu) {
    return await goiApi(URL_CO_SO, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(duLieu)
    });
}

// Cập nhật tác phẩm
async function capNhatTacPham(id, duLieu) {
    return await goiApi(`${URL_CO_SO}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(duLieu)
    });
}

// Xóa tác phẩm
async function xoaTacPhamAPI(id) {
    return await goiApi(`${URL_CO_SO}/${id}`, {
        method: 'DELETE'
    });
}

// Cập nhật lượt thích sử dụng jQuery AJAX theo yêu cầu
function capNhatLuotThich(id, luotThichMoi) {
    return new Promise((thanhCong, thatBai) => {
        $.ajax({
            url: `${URL_CO_SO}/${id}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ likes: luotThichMoi }),
            success: function(duLieu) {
                thanhCong(duLieu);
            },
            error: function(loi) {
                console.error("Lỗi cập nhật lượt thích:", loi);
                thatBai(loi);
            }
        });
    });
}
