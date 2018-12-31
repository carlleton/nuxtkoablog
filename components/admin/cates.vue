<template>
  <el-select v-model="editid" style="width:150px;">
    <el-option v-for="cate in cates" :value="cate.id" :label="cateshow(cate.path)+cate.catename" :key="cate.id">
      {{cateshow(cate.path)}}{{cate.catename}}
    </el-option>
  </el-select>
</template>
<script>
import axios from 'axios'
export default {
  props: ['cid', 'handleChange'],
  data() {
    return {
      editid: 0,
      cates: []
    }
  },
  created() {
    this.editid = this.cid
  },
  watch: {
    cid(newval, oldval) {
      this.editid = newval
    },
    editid(newval, oldval) {
      this.$emit('update:cid', newval)
    }
  },
  async mounted() {
    let cates = await axios.get('/api/cates/list')
    this.cates = [{
      id: 0,
      catename: '未分类',
      path: ''
    }].concat(cates.data)
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
