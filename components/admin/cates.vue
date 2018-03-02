<template>
  <Select v-model="cid" style="width:150px;">
    <Option value="0">未分类</Option>
    <Option v-for="cate in cates" :value="cate.id" :key="cate.id">
      {{cateshow(cate.path)}}{{cate.catename}}
    </Option>
  </Select>
</template>
<script>
import axios from 'axios'
export default {
  props: ['cid'],
  async asyncData() {
    let cates = await axios.get('http://localhost:3001/api/cates/list')
    return {
      cates: cates.data
    }
  },
  methods: {
    cateshow(value) {
      var vals = value.split(',')
      var str = ''
      var deep = 3
      if (vals.length > deep) {
        str += new Array(vals.length - deep).join('┆')
      }
      if (vals.length > deep - 1) {
        str += '└'
      }
      return str
    }
  }
}
</script>
