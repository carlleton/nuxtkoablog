<template>
  <div>
    <div class="tabletit">
      <el-breadcrumb name="breadcrumb" separator-class="el-icon-arrow-right" class="left">
        <el-breadcrumb-item>home</el-breadcrumb-item>
        <el-breadcrumb-item to="./list">内容列表</el-breadcrumb-item>
        <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form ref="posts" :model="posts" :rules="ruleValidate" label-position="top" label-width="0" style="overflow:auto;">
      <div style="width:800px;float:left;">
        <el-form-item label="标题" prop="title">
          <el-input v-model="posts.title" :disabled="act=='cate'"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <mavon-editor v-model="posts.content"></mavon-editor>
        </el-form-item>
      </div>
      <div style="width:200px;float:left;margin-left:10px;">
        <el-form-item label="分类" v-if="act!='cate'">
          <Cates :cid.sync="posts.cid"></Cates>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="posts.status">
              <el-option value="published">发布</el-option>
              <el-option value="draft">草稿</el-option>
              <el-option value="disabled">禁用</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="添加时间" prop="addtime">
          <el-date-picker type="date" size="small" placeholder="选择日期" v-model="posts.addtime"></el-date-picker>
        </el-form-item>
        <el-form-item label="关键词" prop="tags">
          <el-input v-model="posts.tags"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit()">提交</el-button>
          <el-button type="ghost" @click="handleReset()" style="margin-left: 8px">重置</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
import axios from 'axios'
import _ from 'lodash'
import Cates from '~/components/admin/cates'

export default {
  layout: 'admin',
  head() {
    return {
      title: this.title
    }
  },
  data() {
    return {
      title: '添加内容',
      act: 'add',
      posts: {
        title: '',
        cid: 0,
        status: 'published',
        content: '',
        tags: '',
        addtime: new Date(),
        id: '',
        updatetime: ''
      },
      // 校验
      ruleValidate: {
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        addtime: [
          {required: true, type: 'date', message: '请输入正确的日期', trigger: 'change'}
        ]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      var id = this.$route.query.id
      var cid = this.$route.query.cid
      var result
      if (id) {
        this.act = 'edit'
        this.title = '编辑内容'
        result = await axios.get('/api/posts/' + id)
        console.log(result)
        this.posts = result.data
        this.posts.addtime = new Date(this.posts.addtime)
        console.log(this.posts)
      } else if (cid) {
        this.act = 'cate'
        result = await axios.get('/api/posts/cate' + cid)
        this.posts = result.posts
        this.posts.addtime = new Date(this.posts.addtime)
        this.title = '编辑' + this.posts.title
      }
    },
    handleSubmit() {
      this.$refs.posts.validate((valid) => {
        if (valid) {
          var url
          var params = _.clone(this.posts)
          params.addtime = params.addtime.getTime()
          if (this.act === 'add') {
            console.log(params)
            url = '/api/posts/add'
            axios.post(url, params).then((res) => {
              if (res.data.id) {
                this.$message({
                  message: '添加成功',
                  duration: 2000,
                  onClose: () => this.$router.push('./list')
                })
              }
            })
          } else {
            url = '/api/posts/update'
            axios.post(url, params).then((res) => {
              if (res.data.rows > 0) {
                this.$message({
                  message: '更新成功',
                  duration: 2000,
                  onClose: () => this.$router.push('./list')
                })
              }
            })
          }
        } else {
          this.$message.error('校验失败!')
        }
      })
    },
    handleReset() {
      this.$refs.posts.resetFields()
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
