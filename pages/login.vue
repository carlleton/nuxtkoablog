<template>
  <div class="login">
    <div class="form">
      <div class="form-group formtitle">
        登陆
      </div>
      <div class="form-group">
        <el-input type="text" id="username" placeholder="登录名" auto-complete="off" v-model="username"></el-input>
      </div>
      <div class="form-group">
        <el-input type="password" id="userpass" placeholder="密码" v-model="userpass" @keyup.enter="login"></el-input>
      </div>
      <div class="form-group">
        <el-button class="btn" type="primary" v-on:keyup.enter="login" @click="login">登陆</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import { setToken } from '../util/tools'

export default {
  head: {
    title: '登陆'
  },
  layout: 'login',
  name: 'admin',
  data() {
    return {
      username: '',
      userpass: ''
    }
  },
  methods: {
    login() {
      axios.post('/api/users/login', {
        username: this.username,
        userpass: this.userpass
      }).then((res) => {
        let data = res.data
        console.log(data)
        if (data.code !== 200) {
          this.$message(data.message)
        } else {
          setToken(data.token)
          this.$router.replace('/admin')
        }
      }).catch((err) => {
        this.$message({
          message: err.message,
          type: 'error'
        })
      })
    }
  }
}
</script>
<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.form {
    width: 300px;
}
.form-group {
  margin-bottom: 25px;
  position: relative;
  font-size: 16px;
}
.formtitle{
  text-align: center;
}
label {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  margin: auto;
  width: 30px;
  line-height: 40px;
  text-align: center;
  color: #f7fafc;
}
input,
button {
  display: block;
  width: 100%;
  height: 40px;
  border-radius: 4px;
  color: #fff;
}
input {
  background: transparent;
  border: solid 1px #f7fafc;
  text-indent: 30px;
}

/*input::-webkit-input-placeholder {
    color: #f7fafc;
}*/
button:focus,
input:focus {
  box-shadow: 0 0 8px rgba(250, 250, 250, 0.9);
}
button {
  border: none;
  font-size: 20px;
  background: rgba(42, 136, 197, 0.9);
}
button:hover {
  background: rgba(42, 136, 197, 1);
}
@media screen and (max-width: 960px) {
  .form {
    width: 280px;
  }
  .form-group {
    margin-bottom: 20px;
  }
}
</style>
