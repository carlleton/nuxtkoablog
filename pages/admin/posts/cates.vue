<template>
  <div>
    <div class="tabletit">
      <el-breadcrumb name="breadcrumb" separator=">" class="left">
        <el-breadcrumb-item>home</el-breadcrumb-item>
        <el-breadcrumb-item>分类管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="tabletit">
      父分类：<Cates :cid.sync="pid"></Cates>
      <el-input v-model="catename" placeholder="分类名称" style="width:200px;margin-left:10px;"></el-input>
      <el-input v-model="orderid" placeholder="排序" style="width:75px;margin-left:10px;"></el-input>
      <el-button @click="addcate()" style="margin-left:10px;" v-if="act!=='edit'">添加</el-button>
      <el-button @click="updateCate()" style="margin-left:10px;" v-if="act==='edit'">保存</el-button>
    </div>
    <el-table border :data="cates" style="width:800px;">
      <el-table-column
        prop="id"
        label="id"
        width="120"
        :formatter="formatter_id">
      </el-table-column>
      <el-table-column
        prop="catename"
        label="名称">
      </el-table-column>
      <el-table-column
        prop="pid"
        label="父id">
      </el-table-column>
      <el-table-column
        prop="orderid"
        label="排序">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
      cates: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      let cates = await this.$axios.$get('/api/cates/list')
      this.cates = cates.data
    },
    addcate() {
      if (this.catename === '') {
        this.$message.error('请输入分类名称')
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
          this.$message({
            message: '添加成功',
            duration: 2000,
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
        this.$message.error('请输入分类名称')
        return
      }
      var url = '/api/cates/update'
      var params = {
        catename: this.catename,
        pid: this.pid,
        orderid: this.orderid,
        id: this.editid
      }
      this.$axios.post(url, params).then((res) => {
        if (res.data.rows > 0) {
          this.$message({
            message: '更新成功',
            duration: 2000,
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
      }).then(() => {
        var url = '/api/cates/del'
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
