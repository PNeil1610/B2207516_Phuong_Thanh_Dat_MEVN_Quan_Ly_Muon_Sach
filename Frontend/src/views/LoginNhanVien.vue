<style scoped>
  h2 {
    color: #b89e25;
  }

  button {
    background-color: #b89e25;
    color: white;
    border: none;
  }

  button:hover {
    background-color: #e2bc13;
  }
</style>

<template>
  <div class="container d-flex justify-content-center align-items-center vh-50 mt-5">
    <div class="card p-3 shadow-lg" style="max-width: 400px; width: 100%;">
      <h2 class="text-center">Đăng nhập nhân viên</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="sdt" class="form-label">Số điện thoại</label>
          <input type="text" id="dienthoaiNV" v-model="dienthoaiNV" class="form-control" placeholder="Nhập số điện thoại" required />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Mật khẩu</label>
          <input type="password" id="matkhauNV" v-model="matkhauNV" class="form-control" placeholder="Nhập mật khẩu" required />
        </div>
        <button type="submit" class="btn btn-primary w-100">Đăng nhập</button>
      </form>
      <div class="text-start mt-2">
        <router-link to="/login-docgia" class="text-decoration-none text-muted">Là độc giả?</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      dienthoaiNV: '',
      matkhauNV: '',
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post('http://localhost:3000/api/nhanvien/login', { 
          dienthoaiNV: this.dienthoaiNV, 
          matkhauNV: this.matkhauNV 
        });

        // Lấy thông tin từ API
        const chucVu = response.data?.chucvuNV || response.data?.user?.chucvuNV;
        const id = response.data?._id || response.data?.user?._id; 

        // Kiểm tra vai trò
        let role = 'docgia';
        if (chucVu === 'quanly') {
          role = 'quanly';
        } else if (chucVu) {
          role = 'nhanvien';
        }

        // Lưu thông tin vào Vuex store
        this.$store.dispatch("login", { _id: id, role: role});

        alert('Đăng nhập nhân viên thành công');
        this.$router.push('/'); // Chuyển hướng về trang chủ
      } catch (error) {
        if (error.response) {
          if (error.response.status === 404 || error.response.status === 500) {
            alert('Số điện thoại chưa được đăng ký!');
          } else if (error.response.status === 401) {
            alert('Mật khẩu không đúng!');
          } else {
            alert('Lỗi hệ thống, vui lòng thử lại!');
          }
        } else {
          alert('Không thể kết nối đến máy chủ!');
        }
      }
    }
  }
};
</script>