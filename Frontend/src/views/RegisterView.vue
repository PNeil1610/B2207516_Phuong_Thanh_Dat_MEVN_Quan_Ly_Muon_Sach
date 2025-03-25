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

  span {
    color: #b89e25;
  }
</style>

<template>
  <div class="container d-flex flex-column justify-content-center align-items-center vh-50 mt-5">
    <div class="card p-3 shadow-sm w-100" style="max-width: 400px;">
      <h2 class="text-center mb-3">Đăng ký</h2>
      <form @submit.prevent="handleRegister">
        <div class="mb-3">
          <input type="text" class="form-control" v-model="tenDG" placeholder="Học và tên" required />
        </div>
        <div class="mb-3">
          <input type="text" class="form-control" v-model="dienthoaiDG" placeholder="Số điện thoại" required />
        </div>
        <div class="mb-3">
          <input type="password" class="form-control" v-model="matkhauDG" placeholder="Mật khẩu" required />
        </div>
        <div class="mb-3">
          <input type="password" class="form-control" v-model="confirmmatkhauDG" placeholder="Xác nhận mật khẩu" required />
        </div>
        <button type="submit" class="btn btn-primary w-100">Đăng ký</button>
      </form>
      <div class="text-center mt-3">
        <p class="mb-0">Bạn đã có tài khoản? 
          <router-link to="/login-docgia" class="text-decoration-none"><span>Đăng nhập</span></router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      tenDG: '',
      dienthoaiDG: '',
      matkhauDG: '',
      confirmmatkhauDG: '',
    };
  },
  methods: {
    async handleRegister() {
      if (this.matkhauDG !== this.confirmmatkhauDG) {
        alert('Mật khẩu không khớp!');
        return;
      }

      try {
        await axios.post('http://localhost:3000/api/docgia/register', { 
          tenDG: this.tenDG,
          dienthoaiDG: this.dienthoaiDG, 
          matkhauDG: this.matkhauDG, 
          confirmmatkhauDG: this.confirmmatkhauDG });
        alert('Đăng ký thành công');
        this.$router.push('/login-docgia');
      } catch (error) {
        alert(error.response?.data?.message || 'Đăng ký thất bại');
      }
    }
  }
};
</script>