<template>
  <div>
    <div class="tabletit">
      <el-breadcrumb name="breadcrumb" separator-class="el-icon-arrow-right" class="left">
        <el-breadcrumb-item>home</el-breadcrumb-item>
        <el-breadcrumb-item to="./list">内容列表</el-breadcrumb-item>
        <el-breadcrumb-item>{{this.title}}</el-breadcrumb-item>
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
        <el-form-item label="关键词" prop="tags">
          <el-input v-model="posts.tags"></el-input>
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
  head: {
    title: this.title
  },
  data() {
    return {
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
  async asyncData({query}) {
    var act = 'add'
    var title = '添加内容'
    var posts = {
      title: '',
      cid: 0,
      status: 'published',
      content: '',
      tags: '',
      addtime: '',
      id: '',
      updatetime: ''
    }
    var id = query.id
    var cid = query.cid
    var result
    if (id) {
      act = 'edit'
      title = '编辑内容'
      result = await axios.get('/api/posts/' + id)
      console.log(result)
      posts = result.data
      posts.addtime = new Date(posts.addtime)
      console.log(posts)
    } else if (cid) {
      act = 'cate'
      result = await axios.get('/api/posts/cate' + cid)
      posts = result.posts
      posts.addtime = new Date(posts.addtime)
      title = '编辑' + posts.title
    } else {
      posts.addtime = new Date()
      posts.cid = 0
    }
    let cates = await axios.get('/api/cates/list')
    return {
      act: act,
      title: title,
      cates: cates.data,
      posts: posts
    }
  },
  mounted() {
  },
  methods: {
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
                this.$Message.info({
                  content: '添加成功',
                  duration: 2,
                  onClose: () => this.$router.push('./list')
                })
              }
            })
          } else {
            url = '/api/posts/update'
            axios.post(url, params).then((res) => {
              if (res.data.rows > 0) {
                this.$Message.info({
                  content: '更新成功',
                  duration: 2,
                  onClose: () => this.$router.push('./list')
                })
              }
            })
          }
        } else {
          this.$Message.error('校验失败!')
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
