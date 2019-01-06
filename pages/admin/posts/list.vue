<template>
  <div>
    <div class="tabletit">
      <Breadcrumb name="breadcrumb" separator=">" class="left">
        <BreadcrumbItem>home</BreadcrumbItem>
        <BreadcrumbItem>内容列表</BreadcrumbItem>
      </Breadcrumb>
      <div class="right">
        <Button type="primary" size="small" @click="gotoadd()">添加</Button>
      </div>
    </div>
    <div class="tabletit">
      分类：<Cates :cid.sync="search.cid"></Cates>
      <Input v-model="search.keyword" placeholder="关键词" style="width:200px;margin-left:10px;"></Input>
      <Button type="primary" style="margin-left:10px;" size="small" @click="goSearch()">搜索</Button>
    </div>
    <Table border :columns="columns" :data="postsdata">
    </Table>
    <Page
      :total="total"
      :page-size="pageSize"
      :current.sync="currentPage"
      @on-change="handleCurrentChange"
      v-show="total > pageSize"
      ></Page>
  </div>
</template>
<script>
import {dateFormat} from '~/util/tools'
import Cates from '~/components/admin/cates'
let pageSize = process.env.pageSize

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
      },
      columns: [
        { title: 'id', key: 'id', width: 50 },
        {
          title: '标题',
          render: (h, obj) => {
            let row = obj.row
            return
            h(
              'nuxt-link',
              {
                props: {
                  to:'/post/' + row.id,
                  target:"_blank"
                }
              },
              row.title
            )
          }
        },
        {
          title: '分类',
          width: 150,
          render: (h, obj) => {
            let row = obj.row
            return h('span', this.formater_catename(row))
          }
        },
        {
          title: '时间',
          width: 100,
          render: (h, obj) => {
            let row = obj.row
            return h('span', this.formater_addtime(row))
          }
        },
        {
          title: '操作',
          width: 150,
          render: (h, obj) => {
            let index = obj.index
            let row = obj.row
            return h('div', [
              h('Button', {
                props: { size: 'mini' },
                on: {
                  click: () => {
                    this.$router.push('./detail?id=' + row.id)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: { size: 'mini', type: 'danger' },
                on: {
                  click: () => {
                    this.handleDelete(index, row)
                  }
                }
              }, '删除')
            ])
          }
        }
      ]
    }
  },
  async asyncData({query, $axios}) {
    var pageNum = query.page || 1
    var cid = query.cid || ''
    var url = '/api/posts/list?page=' + pageNum + '&cid=' + cid
    let {data} = await $axios.$get(url)
    let cates = await $axios.$get('/api/cates/list')

    return {
      cates: cates.data,
      postsdata: data.data || [],
      total: data.total || 0,
      pageSize: pageSize,
      currentPage: pageNum
    }
  },
  methods: {
    async getData() {
      var pageNum = this.currentPage || this.$route.query.page || 0
      var cid = this.$route.query.cid || 0
      var url = '/api/posts/list?page=' + pageNum + '&cid=' + cid
      let {data} = await this.$axios.$get(url)
      this.postsdata = data.data
    },
    async goSearch() {
      var pageNum = this.$route.query.page || 0
      var cid = this.search.cid || ''
      var url = '/api/posts/list?page=' + pageNum + '&cid=' + cid + '&keyword=' + this.search.keyword
      let {data} = await this.$axios.$get(url)
      this.postsdata = data.data
    },
    handleCurrentChange(currentPage) {
      this.getData()
    },
    // 删除操作
    handleDelete(index, row) {
      var id = row.id
      this.$confirm('您确认要删除吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        loading: true,
        type: 'warning'
      }).then(() => {
        var url = '/api/posts/del'
        var sendData = {
          id: id
        }
        this.$axios.post(url, sendData).then((res) => {
          if (res.data.rows > 0) {
            this.$message({
              type: 'success',
              message: '删除' + res.data.rows + '条'
            })
            this.getData()
          } else {
            console.log(res.data)
            this.$message({
              type: 'error',
              message: '删除失败'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      console.log('delete', row.id)
    },
    gotoadd() {
      this.$router.push('./detail')
    },
    // 多级分类
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
    },
    // 分类格式化
    formater_catename(row) {
      var cate = this.cates.filter(cate => row.cid === cate.id)
      var catename = '未分类'
      if (cate.length > 0) {
        catename = cate[0].catename
      }
      return catename
    },
    // 时间格式化
    formater_addtime(row) {
      return dateFormat(new Date(row.addtime), 'yyyy-MM-dd')
    }
  },
  components: {
    Cates
  }
}
</script>
<style scoped>

</style>
