<style scoped>
  form {
    max-width: 500px;
    margin: 20px auto;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .form-group {
    margin-bottom: 15px;
  }

  label {
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
  }

  input,
  select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
  }

  input:focus,
  select:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }

  .btn {
    padding: 10px 15px;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    transition: 0.3s;
  }

  .btn-success {
    background-color: #28a745;
    border: none;
    color: white;
  }

  .btn-success:hover {
    background-color: #218838;
  }

  .btn-secondary {
    background-color: #6c757d;
    border: none;
    color: white;
  }

  .btn-secondary:hover {
    background-color: #5a6268;
  }

  .ml-2 {
    margin-left: 10px;
  }
</style>

<template>
  <form @submit.prevent="submitForm">
    <div class="form-group">
      <label for="tenSach">Tên Sách</label>
      <input
        type="text"
        class="form-control"
        v-model="bookLocal.tenSach"
        required
      />
    </div>
     <div class="form-group">
      <label for="maNXB">Nhà Xuất Bản</label>
      <select v-model="bookLocal.maNXB" class="form-control" required>
        <option value="" disabled>-- Chọn nhà xuất bản --</option>
        <option v-for="nxb in nxbList" :key="nxb._id" :value="nxb._id">
          {{ nxb.tenNXB }}
        </option>
      </select>
    </div>
    <!-- <div class="form-group">
    <label for="soquyenSach">Số lượng quyển</label>
    <input
      type="number"
      class="form-control"
      v-model.number="bookLocal.soquyenSach"
      disabled
    />
    </div> -->


    <div class="form-group">
      <label for="dongiaSach">Đơn giá</label>
      <input
        type="number"
        v-model.number="bookLocal.dongiaSach"
        class="form-control"
        id="dongiaSach"
        required
      />
    </div>
    <div class="form-group">
      <label for="namXB">Năm xuất bản</label>
      <input
        type="number"
        v-model.number="bookLocal.namXB"
        class="form-control"
        id="namXB"
        required
      />
    </div>
    <div class="form-group">
      <label for="tacgia">Tác giả</label>
      <input
        type="text"
        v-model="bookLocal.tacgia"
        class="form-control"
        id="tacgia"
        required
      />
    </div>
    <!-- <div class="form-group">
      <label for="hinhAnh">Ảnh sách:</label>
      <input type="file" id="hinhAnh" @change="onFileChange" />
    </div> -->
    <button class="btn btn-success">Lưu</button>
    <button
      type="button"
      class="btn btn-secondary ml-2"
      @click="$emit('cancel')"
    >
      Hủy
    </button>
  </form>
</template>
<script>
  export default {
    props: {
      book: {
        type: Object,
        default: () => ({
          tenSach: '',
          maNXB: '',
          soquyenSach: 1,
          dongiaSach: 0,
          namXB: 2010,
          tacgia: '',
        })
      },
      nxbList: { type: Array, required: true }
    },
    data() {
      return {
        bookLocal: { ...this.book },
        formKey: 0
      }
    },
    watch: {
      book: {
        handler(newVal) {
          this.bookLocal = { ...newVal }
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      // onFileChange(event) {
      //   const file = event.target.files[0]
      //   if (file) {
      //     this.bookLocal.hinhAnh = file
      //   }
      // },
      submitForm() {
        if (!this.bookLocal.maNXB) {
          alert('Vui lòng chọn Nhà Xuất Bản!')
          return
        }

        const bookData = { ...this.bookLocal }
        this.$emit('submit', bookData)

      }
    }
  }
</script>