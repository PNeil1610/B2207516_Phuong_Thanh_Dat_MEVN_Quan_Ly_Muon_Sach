<style scoped>
.borrow-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  text-align: center;
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #5a4631;
}

button {
  margin: 10px;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-add {
  background-color: #b89e25;
  color: white;
}

.btn-add:hover {
  background-color: #e2bc13;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

.borrow-form {
  background: white;
  padding: 15px;
  margin-top: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

label {
  font-weight: bold;
  display: block;
  margin-top: 10px;
}

select, input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  background: #e9ecef;
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

li button {
  font-size: 14px;
}
</style>

<template>
  <div class="borrow-container">
    <h2> Đăng Ký Mượn Sách</h2>

    <button class="btn btn-add" @click="showBorrowForm = true">
      Thêm Phiếu Mượn
    </button>

    <div v-if="showBorrowForm" class="borrow-form">
      <h3>Phiếu Mượn</h3>
      
      <label for="book">Chọn sách:</label>
      <select v-model="selectedBook" @change="updateAvailableQuantity">
        <option v-for="book in books" :key="book._id" :value="book">
          {{ book.tenSach }} (Còn: {{ book.soquyenSach}})
        </option>
      </select>

      <!-- <label for="quantity">Số lượng mượn:</label>
      <input type="number" v-model.number="quantity" :max="selectedBook ? selectedBook.soquyenSach : 1" min="1" /> -->
      <!-- <button class="btn btn-secondary" @click="showBorrowForm = false">
        Hủy
      </button> -->
      <button class="btn btn-add" @click="registerBorrow">Đăng Ký Mượn</button>
      <button @click="cancelBorrow" class="btn-cancel">Hủy Phiếu Mượn</button>
    </div>
  </div>
</template>

<script>
import { getBooks, dangKyMuonSach } from "@/services/muonSachService";
import { useStore } from 'vuex';

export default {
  data() {
    const store = useStore(); // Khởi tạo store trong data
    return {
      store, // Lưu store để sử dụng trong computed
      showBorrowForm: false,
      books: [],
      selectedBook: null,
      quantity: 1,
      ngayMuon: "",
    };
  },

  computed: {
    docGiaId() {
      return this.store.state.user._id; // Lấy id từ Vuex store
    },
  },

  methods: {
    async loadBooks() {
      this.books = await getBooks();
    },

    updateAvailableQuantity() {
      this.quantity = 1;
    },

    openBorrowForm() {
      const today = new Date();
      this.ngayMuon = today.toISOString().split("T")[0];
    },

    async registerBorrow() {
      this.openBorrowForm();

      try {
        console.log(this.selectedBook.maSach);
        await dangKyMuonSach(this.docGiaId, this.selectedBook._id, this.quantity, this.ngayMuon);
        alert("Đăng ký mượn thành công! Vui lòng chờ duyệt.");
        this.selectedBook = null;
        this.quantity = 1;
        this.showBorrowForm = false;
      } catch (error) {
        alert(error.response?.data?.message || "Lỗi không xác định!");
        console.error(error);
      }
    },

    cancelBorrow() {
      this.selectedBook = null;
      this.quantity = 1;
      this.showBorrowForm = false;
    },
  },

  mounted() {
    this.loadBooks();
  },
};
</script>