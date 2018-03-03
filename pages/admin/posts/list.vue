<template>
  <div>
    <div class="tabletit">
      <el-breadcrumb name="breadcrumb" separator=">" class="left">
        <el-breadcrumb-item>home</el-breadcrumb-item>
        <el-breadcrumb-item>内容列表</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="right">
        <el-button type="primary" size="small" @click="gotoadd()">添加</el-button>
      </div>
    </div>
    <div class="tabletit">
      分类：<Cates :cid.sync="search.cid"></Cates>
      <el-input v-model="search.keyword" placeholder="关键词" style="width:200px;margin-left:10px;"></el-input>
      <el-button type="primary" style="margin-left:10px;" size="small" @click="goSearch()">搜索</el-button>
    </div>
    <el-table border :data="postsdata">
      <el-table-column
        prop="id"
        label="id"
        width="120">
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题">
      </el-table-column>
      <el-table-column
        prop="catename"
        label="分类"
        :formatter="formater_catename">
      </el-table-column>
      <el-table-column
        prop="addtime"
        label="时间"
        :formatter="formater_addtime">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="$router.push('./detail?id=' + scope.row.id)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import axios from 'axios'
import tools from '../../../util/tools'
import Cates from '~/components/admin/cates'

export default {
  layout: 'admin',
  head: {
    title: '内容列表页'
  },
  data() {
    return {
      search: {
        cid: 0,
        keyword: ''
      }
    }
  },
  async asyncData({query}) {
    var pageNum = query.page || 0
    var cid = query.cid || ''
    var url = 'http://localhost:3001/api/posts/list?page=' + pageNum + '&cid=' + cid
    let {data} = await axios.get(url)
    let cates = await axios.get('http://localhost:3001/api/cates/list')
    return {
      cates: cates.data,
      postsdata: data
    }
  },
  methods: {
    formater_catename(row, column) {
      var cate = this.cates.filter(cate => row.cid === cate.id)
      var catename = '未分类'
      if (cate.length > 0) {
        catename = cate[0].catename
      }
      return catename
    },
    formater_addtime(row, column) {
      return tools.Dateformat(new Date(row.addtime), 'yyyy-MM-dd')
    },
    async getData() {
      console.log(this.$route)
      var pageNum = this.$route.query.page || 0
      var cid = this.$route.query.cid || 0
      var url = 'http://localhost:3001/api/posts/list?page=' + pageNum + '&cid=' + cid
      let {data} = await axios.get(url)
      this.postsdata = data
    },
    async goSearch() {
      var pageNum = this.$route.query.page || 0
      var cid = this.search.cid || ''
      var url = 'http://localhost:3001/api/posts/list?page=' + pageNum + '&cid=' + cid + '&keyword=' + this.search.keyword
      let {data} = await axios.get(url)
      this.postsdata = data
    },
    handleDelete(index, row) {
      var id = row.id
      this.$Modal.confirm({
        title: '删除',
        content: '<p>您确认要删除吗？</p>',
        loading: true,
        onOk: () => {
          var url = '/api/posts/del'
          var sendData = {
            id: id
          }
          axios.post(url, sendData).then((res) => {
            if (res.data.rows > 0) {
              this.$Modal.remove()
              this.$Message.info('删除' + res.data.rows + '条')
              this.getData()
            } else {
              console.log(res.data)
              this.$Modal.remove()
              this.$Message.info('删除失败')
            }
          })
        },
        onCancel: () => {
          this.$Message.info('delete cancel')
        }
      })
      console.log('delete', row.id)
    },
    gotoadd() {
      this.$router.push('./detail')
    },
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
  },
  components: {
    Cates
  }
}
</script>
<style scoped>

</style>
