<template>
  <div>
    <div class="tabletit">
      <Breadcrumb name="breadcrumb" separator=">" class="left">
        <BreadcrumbItem>home</BreadcrumbItem>
        <BreadcrumbItem>分类管理</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="tabletit">
      父分类：<Cates :cid.sync="pid"></Cates>
      <Input v-model="catename" placeholder="分类名称" style="width:200px;margin-left:10px;"></Input>
      <Input v-model="orderid" placeholder="排序" style="width:75px;margin-left:10px;"></Input>
      <Button @click="addcate()" style="margin-left:10px;" v-if="act!=='edit'">添加</Button>
      <Button @click="updateCate()" style="margin-left:10px;" v-if="act==='edit'">保存</Button>
    </div>
    <Table border :columns="columns" :data="cates" style="width:800px;">
    </Table>
  </div>
</template>
<script>
import Cates from '~/components/admin/cates'

export default {
  layout: 'admin',
  head: {
    title: '分类管理'
  },
  data() {
    return {
      act: '',
      pid: 0,
      catename: '',
      orderid: '',
      editid: '',
      cates: [],
      columns: [
        {
          title: 'id',
          width: 120,
          render: (h, obj) => {
            let row = obj.row
            return h('span', this.formatter_id(row))
          }
        },
        { title: '名称', key: 'catename' },
        { title: '父id', key: 'pid' },
        { title: '排序', key: 'orderid' },
        {
          title: '操作',
          render: (h, obj) => {
            let row = obj.row
            let index = obj.index
            return h(
              'div',
              [
                h(
                  'Button',
                  {
                    props: { size: 'small', type: 'primary' },
                    on: {
                      click: () => {
                        this.handleEdit(index, row)
                      }
                    }
                  },
                  '编辑'
                ),
                h(
                  'Button',
                  {
                    props: { size: 'small', type: 'error' },
                    style: { marginLeft: '10px' },
                    on: {
                      click: () => {
                        this.handleDelete(index, row)
                      }
                    }
                  },
                  '删除'
                )
              ]
            )
          }
        }
      ]
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      let cates = await this.$axios.$get('/api/cates/list')
      this.cates = cates
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
      this.$axios.post(url, params).then((res) => {
        if (res.data.id) {
          this.$Message.info({
            content: '添加成功',
            duration: 2,
            onClose: () => {
              this.act = ''
              this.catename = ''
              this.orderid = ''
              this.getData()
            }
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
        pid: this.pid || 0,
        orderid: this.orderid,
        id: this.editid
      }
      this.$axios.post(url, params).then((res) => {
        if (res.data && res.data.rows > 0) {
          this.$Message.info({
            content: '更新成功',
            duration: 2,
            onClose: () => {
              this.act = ''
              this.catename = ''
              this.pid = 0
              this.orderid = ''
              this.getData()
            }
          })
        }
      })
    },
    handleEdit(index, row) {
      this.act = 'edit'
      this.editid = row.id
      this.pid = row.pid
      this.catename = row.catename
      this.orderid = row.orderid
    },
    handleDelete(index, row) {
      var id = row.id
      this.$confirm('您确认要删除吗？, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        var url = '/api/cates/del'
        var sendData = {
          id: id
        }
        let res = await this.$axios.post(url, sendData)
        if (res && res.data && res.data.rows > 0) {
          this.$Message.success('删除' + res.rows + '条')
          this.getData()
        } else {
          console.log(res)
          this.$Message.error({
            content: '删除失败'
          })
        }
      })
      console.log('delete', row.id)
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
    },
    // 格式化id的显示
    formatter_id(row, column) {
      var str = this.cateshow(row.path)
      str += row.id
      return str
    }
  },
  components: {
    Cates
  }
}
</script>
<style>

</style>
