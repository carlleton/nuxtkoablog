<template>
  <div style="width:500px;">
    <Form label-position="right" label-width="100px">
      <FormItem class="tit">
        <strong>密码管理</strong>
      </FormItem>
      <FormItem label="旧密码">
        <Input type="password" v-model="oldpass" placeholder="请输入旧密码"></Input>
      </FormItem>
      <FormItem label="新密码">
        <Input type="password" v-model="newpass" placeholder="请输入新密码"></Input>
      </FormItem>
      <FormItem label="重新输入">
        <Input type="password" v-model="repass" placeholder="请重新输入密码"></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="changePass()">更改密码</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { getUserName } from '../../../util/tools'

export default {
  layout: 'admin',
  data() {
    return {
      oldpass: '',
      newpass: '',
      repass: ''
    }
  },
  methods: {
    async changePass() {
      if (this.newpass !== this.repass) {
        this.$message({
          message: '新密码和确认密码必须一致',
          type: 'error'
        })
      }
      let url = '/api/users/changePass'
      let params = {
        username: getUserName(),
        oldpass: this.oldpass,
        newpass: this.newpass
      }
      let res = await this.$axios.post(url, params)
      if (res.data && res.data.code === 200) {
        this.$message({
          message: '更改成功',
          duration: 2000
        })
      }
    }
  }
}
</script>
