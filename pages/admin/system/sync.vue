<template>
  <div style="width:500px;">
    <Form label-position="right" label-width="100px">
      <FormItem>
        <Button @click="doinit()">初始化</Button>
      </FormItem>
      <FormItem>
        <div>
          <p v-for="(item,index) in results" :key="index">
            {{item}}
          </p>
        </div>
      </FormItem>
    </Form>
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
