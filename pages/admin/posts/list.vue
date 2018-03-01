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
    <Table stripe :columns="columns" :data="postsdata"></Table>
  </div>
</template>
<script>
import axios from 'axios'
import tools from '../../../util/tools'

export default {
  layout: 'admin',
  head: {
    title: '内容列表页'
  },
  data() {
    return {
      columns: [
        {
          title: 'id',
          key: 'id'
        },
        {
          title: '标题',
          key: 'title'
        },
        {
          title: '分类',
          key: 'catename'
        },
        {
          title: '时间',
          key: 'addtime',
          render: (h, params) => {
            return h('div',
              tools.Dateformat(new Date(params.row.addtime), 'yyyy-MM-dd')
            )
          }
        },
        {
          title: '操作',
          key: 'events',
          fixed: 'right',
          width: 130,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.$router.push('./detail?id=' + params.row.id)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    var id = params.row.id
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
                    console.log('delete', params.row.id)
                  }
                }
              }, '删除')
            ])
          }
        }
      ]
    }
  },
  async asyncData({query}) {
    var pageNum = query.pageNum || 0
    var url = 'http://localhost:3001/api/posts/list/' + pageNum
    let {data} = await axios.get(url)
    return {
      postsdata: data
    }
  },
  methods: {
    async getData() {
      console.log(this.$route)
      var pageNum = this.$route.query.pageNum || 0
      var url = 'http://localhost:3001/api/posts/list/' + pageNum
      let {data} = await axios.get(url)
      this.postsdata = data
    },
    gotoadd() {
      this.$router.push('./add')
    }
  }
}
</script>
<style scoped>

</style>
