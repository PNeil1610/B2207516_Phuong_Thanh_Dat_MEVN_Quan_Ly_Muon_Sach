<style scoped>
h2 {
  color: #5a4631;
}

.text-warning {
  color: rgb(220, 11, 11);
}
.text-primary {
  color: blue;
}
.text-success {
  color: green;
}
</style>

<template>
  <div class="container mt-4">
    <h2 class="mb-3">Lịch sử mượn sách</h2>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Tên Sách</th>
          <th>Ngày mượn</th>
          <th>Ngày trả</th>
          <!-- <th>Số lượng</th> -->
          <th>Trạng thái</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="m in lichSuMuon" :key="m._id">
          <td>{{ gettenSach(m.maSach) || "Không có thông tin" }}</td>
          <td>{{ formatDate(m.ngaymuon) }}</td>
          <td>{{ formatNgay(m.ngaytra) }}</td>
          <!-- <td>{{ m.soquyenSach }}</td> -->
          <td>
            <span :class="getStatusClass(m.trangthai)">
              {{ m.trangthai }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import { fetchBooks } from '@/services/sachService'

export default {
  data() {
    return {
      lichSuMuon: [],
      sachs: [],
    };
  },
  computed: {
    ...mapGetters(["getUser"]), 
  },
  async mounted() {
    try {
      this.sachs = await fetchBooks();
      await this.getLichSuMuon(); // Đảm bảo gọi API lịch sử sau khi có sách
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    }
  },
  methods: {    
    async getLichSuMuon() {
      if (!this.getUser) return; 

      try {
        const res = await axios.get("http://localhost:3000/api/theodoi");
        console.log(res.data);
        this.lichSuMuon = res.data.filter(m => String(m.maDG) === String(this.getUser._id)); 
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử mượn sách:", error);
      }
    },
    gettenSach(maSach) {
      console.log(maSach)
      const sach = this.sachs.find(s => String(s._id) === String(maSach));
      console.log(sach)
      return sach ? sach.tenSach : 'Không tìm thấy'
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    },
    getStatusClass(status) {
      return {
        "text-warning": status === "Chờ duyệt",
        "text-primary": status === "Đang mượn",
        "text-success": status === "Đã trả",
      };
    },
    formatNgay(ngay) {
      if (!ngay) return "Chưa trả"; 
      return new Date(ngay).toLocaleDateString("vi-VN"); 
    }
  }
};
</script>