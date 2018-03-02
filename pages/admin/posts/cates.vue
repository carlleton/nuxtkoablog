<template>
  <div>
    <div class="tabletit">
      <Breadcrumb name="breadcrumb" separator=">" class="left">
        <BreadcrumbItem>home</BreadcrumbItem>
        <BreadcrumbItem>分类管理</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="tabletit">
      父分类：
      <Select v-model="pid" style="width:150px;">
        <Option value="0">未分类</Option>
        <Option v-for="cate in cates" :value="cate.id" :key="cate.id">
          {{cateshow(cate.path)}}{{cate.catename}}
        </Option>
      </Select>
      <Input v-model="catename" placeholder="分类名称" style="width:200px;margin-left:10px;"></Input>
      <Input v-model="orderid" placeholder="排序" style="width:50px;margin-left:10px;"></Input>
      <Button @click="addcate()" style="margin-left:10px;" v-if="act!=='edit'">添加</Button>
      <Button @click="updateCate()" style="margin-left:10px;" v-if="act==='edit'">保存</Button>
    </div>
    <Table stripe :columns="columns" :data="cates" style="width:800px;"></Table>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  layout: 'admin',
  head: {
    title: '分类管理'
  },
  data() {
    return {
      act: '',
      pid: '0',
      catename: '',
      orderid: '',
      editid: '',
      columns: [
        {
          title: 'id',
          key: 'id',
          render: (h, params) => {
            var str = this.cateshow(params.row.path)
            str += params.row.id
            return h('div', str)
          }
        },
        {
          title: '名称',
          key: 'catename'
        },
        {
          title: '父id',
          key: 'pid'
        },
        {
          title: '排序',
          key: 'orderid'
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
                    this.act = 'edit'
                    this.editid = params.row.id
                    this.pid = params.row.pid
                    this.catename = params.row.catename
                    this.orderid = params.row.orderid
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
                        var url = '/api/cates/del'
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
  async asyncData() {
    let cates = await axios.get('http://localhost:3001/api/cates/list')
    return {
      cates: cates.data
    }
  },
  methods: {
    async getData() {
      let cates = await axios.get('http://localhost:3001/api/cates/list')
      this.cates = cates.data
    },
    addcate() {
      if (this.catename === '') {
        this.$Message.error('请输入分类名称')
        return
      }
      var url = '/api/cates/add'
      var params = {
        catename: this.catename,
        pid: this.pid,
        orderid: this.orderid
      }
      axios.post(url, params).then((res) => {
        if (res.data.id) {
          this.$Message.info({
            content: '添加成功',
            duration: 2,
            onClose: () => this.getData()
          })
        }
      })
    },
    updateCate() {
      if (this.catename === '') {
        this.$Message.error('请输入分类名称')
        return
      }
      var url = '/api/cates/update'
      var params = {
        catename: this.catename,
        pid: this.pid,
        orderid: this.orderid,
        id: this.editid
      }
      axios.post(url, params).then((res) => {
        if (res.data.rows > 0) {
          this.$Message.info({
            content: '更新成功',
            duration: 2,
            onClose: () => {
              this.act = ''
              this.catename = ''
              this.pid = '0'
              this.orderid = ''
              this.getData()
            }
          })
        }
      })
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
  }
}
</script>
<style>

</style>
