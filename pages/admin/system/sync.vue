<template>
  <div style="width:500px;">
    <el-form label-position="right" label-width="100px">
      <el-form-item>
        <el-button @click="doinit()">初始化</el-button>
      </el-form-item>
      <el-form-item>
        <div>
          <p v-for="(item,index) in results" :key="index">
            {{item}}
          </p>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  layout: 'admin',
  data() {
    return {
      results: []
    }
  },
  methods: {
    async doinit() {
      var tables = ['cates', 'notecates', 'notes', 'posts']
      console.log(tables)
      for (let i in tables) {
        let url = '/api/usns/init'
        let params = {
          tag: parseInt(i) + 1,
          table: tables[i]
        }
        console.log(params)
        let res = await this.$axios.post(url, params)
        if (res.data && res.data.code === 200) {
          this.results.push(res.data.message)
        } else {
          console.log(res)
        }
      }
    }
  }
}
</script>
