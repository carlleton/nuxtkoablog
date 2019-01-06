<template>
  <div class="login">
    <div class="form">
      <div class="form-group formtitle">
        登陆
      </div>
      <div class="form-group">
        <Input type="text" ref="username" id="username" placeholder="登录名" auto-complete="off" v-model="username" prefix-icon="fa fa-user">
        </Input>
      </div>
      <div class="form-group">
        <Input type="password" id="userpass" placeholder="密码" v-model="userpass" @keyup.enter.native="login" prefix-icon="fa fa-lock"></Input>
      </div>
      <div class="form-group">
        <Button class="btn" type="primary" v-on:keyup.enter="login" @click="login">登陆</Button>
      </div>
    </div>
  </div>
</template>
<script>
import { setToken, setUserName } from '../util/tools'

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
  mounted() {
    this.$refs.username.focus()
  },
  methods: {
    async login() {
      let url = '/api/users/login'
      let params = {
        username: this.username,
        userpass: this.userpass
      }
      let res = await this.$axios.post(url, params)
      let data = res.data
      if (data.code !== 200) {
        this.$Message.error(data.message)
      } else {
        sessionStorage.setItem('token', data.token)
        setUserName(this.username)
        this.$router.replace('/admin')
      }
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
  font-size: 16px;
  font-weight: bold;
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
