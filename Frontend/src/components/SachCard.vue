<style scoped>
.sach-card {
  width: 250px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  text-align: center;
  padding: 15px;
  transition: transform 0.2s ease-in-out;
}

.sach-card:hover {
  transform: scale(1.05);
}

.sach-image {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  border-radius: 8px;
}

.sach-info {
  padding: 10px 0;
}

.sach-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.sach-author, .sach-year, .sach-price, .sach-stock, .sach-publisher {
  font-size: 12pt;
  color: #555;
  margin: 5px 0;
}

.sach-stock.out-of-stock {
  color: red;
  font-weight: bold;
}
</style>

<template>
  <div class="sach-card">
    <div class="sach-info">
      <h2 class="sach-title">{{ sach.tenSach }}</h2>
      <!-- <p class="sach-author"><strong>Mã sách:</strong> {{ sach.maSach || "Không rõ" }}</p> -->
      <p class="sach-author"><strong>Tác giả:</strong> {{ sach.tacgia || "Không rõ" }}</p>
      <p class="sach-year"><strong>Năm Xuất Bản:</strong> {{ sach.namXB || "Không rõ" }}</p>
      <p class="sach-publisher"><strong>Nhà Xuất Bản:</strong>{{ getNXBName(sach.maNXB) || "Không rõ" }}</p>
      <p class="sach-price"><strong>Giá:</strong> {{ formatPrice(sach.dongiaSach) }}</p>
      <p class="sach-stock" :class="{ 'out-of-stock': sach.soQuyen === 0 }">
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

        const manxb = typeof book.maNXB === "object" ? book.maNXB.maNXB : book.maNXB; 
            
        const nxb = this.nxbs.find(n => 
            n.maNXB === manxb || 
            n._id === manxb || 
            String(n._id) === String(manxb) 
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