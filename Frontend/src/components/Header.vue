<style scoped>
    .navbar {
      background: linear-gradient(135deg, #2c3e50, #4ca1af);
      padding: 15px 25px;
      border-bottom: 4px solid #b89e25;
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    }

    .navbar-brand {
      font-size: 22px;
      font-weight: 700;
      color: #f1c40f !important;
      transition: color 0.3s ease, transform 0.3s ease;
    }

    .navbar-brand:hover {
      color: #e74c3c !important;
      transform: scale(1.1);
    }

    .navbar-nav .nav-link {
      font-size: 16px;
      font-weight: 600;
      color: #ecf0f1 !important;
      margin: 0 12px;
      transition: all 0.3s ease;
      padding: 12px 18px;
      border-radius: 6px;
    }

    .navbar-nav .nav-link:hover {
      background: rgba(255, 215, 0, 0.8);
      color: #2c3e50 !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(255, 215, 0, 0.5);
    }

    .navbar-nav .nav-link[to='/logout'] {
      background: #c0392b;
      color: #fff !important;
      border-radius: 6px;
      padding: 12px 18px;
    }

    .navbar-nav .nav-link[to='/logout']:hover {
      background: #a93226;
      transform: translateY(-2px);
    }

    .navbar-toggler {
      border: none;
      outline: none;
    }

    .navbar-toggler:focus {
      box-shadow: none;
    }

    @media (max-width: 992px) {
      .navbar-nav {
        text-align: center;
        padding-top: 12px;
      }

      .navbar-nav .nav-link {
        display: block;
        margin-bottom: 12px;
        padding: 12px;
      }
    }
  </style>

<script>
  export default {
    computed: {
      userRole() {
        return this.$store.state.user.role
      }
    },
    methods: {
      handleLogout() {
        this.$store.dispatch('logout')
        this.$router.push('/login-docgia')
      }
    }
  }
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <router-link class="navbar-brand" to="/">Quản lý mượn sách</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Trang chủ</router-link>
          </li>

          <template v-if="userRole === 'docgia'">
            <li class="nav-item">
              <router-link class="nav-link" to="/muon-sach">
                Mượn Sách
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/lich-su-muon">
                Lịch Sử Mượn
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/tai-khoan">
                Tài Khoản
              </router-link>
            </li>
          </template>

          <template v-else-if="userRole === 'quanly'">
            <li class="nav-item">
              <router-link class="nav-link" to="/quan-ly-sach">
                Quản Lý Sách
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/quan-ly-tai-khoan">
                Quản Lý Tài Khoản
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/theo-doi-muon">
                Theo Dõi Mượn
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/tai-khoan">
                Tài Khoản
              </router-link>
            </li>
          </template>

          <template v-else-if="userRole === 'nhanvien'">
            <li class="nav-item">
              <router-link class="nav-link" to="/theo-doi-muon">
                Theo Dõi Mượn
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/tai-khoan">
                Tài Khoản
              </router-link>
            </li>
          </template>

          <template v-else>
            <li class="nav-item">
              <router-link class="nav-link" to="/login-docgia">
                Đăng nhập
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/register">Đăng ký</router-link>
            </li>
          </template>

          <li class="nav-item" v-if="userRole">
            <router-link class="nav-link" to="/logout" @click="handleLogout">
              Đăng Xuất
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>