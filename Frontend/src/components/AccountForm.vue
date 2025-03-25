<style scoped>
  form {
    max-width: 450px;
    margin: 20px auto;
    padding: 25px;
    background: #f8f9fa;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    font-family: 'Arial', sans-serif;
  }

  .form-group {
    margin-bottom: 15px;
  }

  label {
    font-weight: bold;
    display: block;
    margin-bottom: 6px;
    color: #333;
  }

  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 15px;
    transition: all 0.3s ease-in-out;
  }

  input:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
  }

  .btn {
    padding: 10px 15px;
    border-radius: 6px;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-block;
    text-align: center;
    border: none;
  }

  .btn-success {
    background-color: #28a745;
    color: white;
  }

  .btn-success:hover {
    background-color: #218838;
  }

  .btn-secondary {
    background-color: #6c757d;
    color: white;
  }

  .btn-secondary:hover {
    background-color: #5a6268;
  }

  .btn:active {
    transform: scale(0.95);
  }

  .button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
  }

  .radio-group {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-bottom: 10px;
  }

  .radio-group label {
    display: flex;
    align-items: center;
    gap: 5px;
  }
</style>

<template>
  <form @submit.prevent="saveChanges">
    <label>Địa chỉ:</label>
      <input v-model="form.diachi" type="text" required />

    <div v-if="role === 'docgia'">
    <label>Họ và Tên:</label>
      <input v-model="form.hoten" type="text" required />

      <label>Ngày Sinh:</label>
      <input v-model="form.ngaysinh" type="date" required />

      <label>Giới tính:</label>
      <div class="radio-group">
        <label>
          <input type="radio" value="Nam" v-model="form.gioitinh" required />
          Nam
        </label>
        <label>
          <input type="radio" value="Nữ" v-model="form.gioitinh" required />
          Nữ
        </label>
      </div>
    </div>

    <div v-else>
      <label>Họ và Tên:</label>
      <input v-model="form.hoten" type="text" required />
    </div>

    <div class="button-group">
      <button type="submit" class="btn btn-success" @click="$emit('update')">Lưu</button>
      <button type="button" class="btn btn-secondary" @click="$emit('cancel')">
        Hủy
      </button>
    </div>
  </form>
</template>

<script>
  import { updateUserInfo } from '@/services/accService'

  export default {
    props: {
      user: Object,
      role: String,
      userId: String
    },
    emits: ['cancel', 'update'],
    data() {
      return {
        form: {
          diachi: this.user?.diachi || '',
          hoten: this.user?.hoten || '',
          ngaysinh: this.user?.ngaysinh?.includes('T') 
                  ? this.user.ngaysinh.split('T')[0] 
                  : '',
          gioitinh: this.user?.gioitinh || 'Nam',
        }
      }
    },

    watch: {
      user: {
        handler(newUser) {
          if (newUser) {
            this.form.diachi = newUser.diachi || ''
            this.form.hoten = newUser.hoten || ''
            this.form.ngaysinh = newUser.ngaysinh
              ? newUser.ngaysinh.split('T')[0]
              : ''
            this.form.gioitinh = newUser.gioitinh || 'Nam'
          }
        },
        immediate: true
      }
    },
    methods: {
      async saveChanges() {
        if (!this.userId) {
          alert('Lỗi: Không tìm thấy userId!')
          return
        }

        try {
          let updateData
          if (this.role === 'docgia') {
            updateData = {
              diachiDG: this.form.diachi,
              tenDG: this.form.hoten,
              ngaysinhDG: this.form.ngaysinh,
              gioitinhDG: this.form.gioitinh
            }
          } else {
            updateData = {
              diachiNV: this.form.diachi,
              tenNV: this.form.hoten,
            }
          }
          console.log(updateData)
          await updateUserInfo(this.role, this.userId, updateData)

          alert('Cập nhật thành công!')
          this.$emit('update')
          this.$emit('cancel')
        } catch (error) {
          alert('Có lỗi xảy ra!')
          console.error(error)
        }
      }
    }
  }
</script>