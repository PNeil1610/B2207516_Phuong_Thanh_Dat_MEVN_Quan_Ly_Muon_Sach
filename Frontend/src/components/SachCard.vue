<style scoped>
.sach-card {
  width: 270px;
  background: linear-gradient(135deg, #f8f5f0, #ebe4d1);
  border-radius: 16px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  text-align: center;
  padding: 18px;
  transition: all 0.3s ease-in-out;
  border: 1px solid #c9a66b;
  position: relative;
}

.sach-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
}

.sach-image {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid #c9a66b;
}

.sach-info {
  padding: 12px 0;
}

.sach-title {
  font-size: 20px;
  font-weight: bold;
  color: #2c2c2c;
  letter-spacing: 0.5px;
}

.sach-author, .sach-year, .sach-price, .sach-stock, .sach-publisher {
  font-size: 14px;
  color: #444;
  margin: 6px 0;
}

.sach-price {
  font-size: 16px;
  font-weight: 600;
  color: #c9a66b;
}

.sach-stock {
  font-size: 13px;
  font-weight: bold;
  color: #116466;
}

.sach-stock.out-of-stock {
  color: #d9534f;
}

.luxury-border {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 40px;
  height: 40px;
  border: 2px solid #c9a66b;
  border-radius: 50%;
}

.sach-card:hover .luxury-border {
  background: #c9a66b;
}
</style>

<template>
  <div class="sach-card">
    <div class="luxury-border"></div>
    <div class="sach-info">
      <img class="sach-image" :src="'https://phunugioi.com/wp-content/uploads/2021/11/Hinh-anh-cuon-sach-mo-ra-va-chiec-la-xanh.jpg'" alt="Sach" />
      <h2 class="sach-title">{{ sach.tenSach }}</h2>
      <p class="sach-author"><strong>Tác giả:</strong> {{ sach.tacgia || "Không rõ" }}</p>
      <p class="sach-year"><strong>Năm Xuất Bản:</strong> {{ sach.namXB || "Không rõ" }}</p>
      <p class="sach-publisher"><strong>Nhà Xuất Bản:</strong> {{ getNXBName(sach.maNXB) || "Không rõ" }}</p>
      <p class="sach-price"><strong>Giá:</strong> {{ formatPrice(sach.dongiaSach) }}</p>
      <p class="sach-stock" :class="{ 'out-of-stock': sach.soquyenSach === 0 }">
        <strong v-if="sach.soquyenSach > 0">Số quyển:</strong> {{ sach.soquyenSach > 0 ? `${sach.soquyenSach} quyển` : 'Hết sách' }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    sach: Object,
    nxbs: Object
  },
  methods: {
    getNXBName(book) {
      if (!book) return "Chưa có NXB";

      const nxb = this.nxbs.find(n => 
          n.maNXB === book || 
          n._id === book || 
          String(n._id) === String(book) 
      );
      return nxb ? nxb.tenNXB : "Không tìm thấy";
    },
    formatPrice(price) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND"
      }).format(price);
    }
  }
};
</script>
