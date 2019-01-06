<template>
  <div>
    <div class="tabletit">
      <Breadcrumb name="breadcrumb" separator-class="el-icon-arrow-right" class="left">
        <BreadcrumbItem>home</BreadcrumbItem>
        <BreadcrumbItem to="./list">内容列表</BreadcrumbItem>
        <BreadcrumbItem>{{title}}</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <Form ref="posts" :model="posts" :rules="ruleValidate" label-position="top" label-width="0" style="overflow:auto;">
      <div style="width:800px;float:left;">
        <FormItem label="标题" prop="title">
          <Input v-model="posts.title" :disabled="act=='cate'"></Input>
        </FormItem>
        <FormItem label="内容" prop="content">
          <mavon-editor v-model="posts.content"></mavon-editor>
        </FormItem>
      </div>
      <div style="width:200px;float:left;margin-left:10px;">
        <FormItem label="分类" v-if="act!='cate'">
          <Cates :cid.sync="posts.cid"></Cates>
        </FormItem>
        <FormItem label="状态" prop="status">
          <Select v-model="posts.status">
              <Option value="published">发布</Option>
              <Option value="draft">草稿</Option>
              <Option value="disabled">禁用</Option>
          </Select>
        </FormItem>
        <FormItem label="添加时间" prop="addtime">
          <DatePicker type="date" size="small" placeholder="选择日期" v-model="posts.addtime"></DatePicker>
        </FormItem>
        <FormItem label="关键词" prop="tags">
          <Input v-model="posts.tags"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit()">提交</Button>
          <Button type="ghost" @click="handleReset()" style="margin-left: 8px">重置</Button>
        </FormItem>
      </div>
    </Form>
  </div>
</template>
<script>
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
        result = await this.$axios.$get('/api/posts/' + id)
        console.log(result)
        this.posts = result
        this.posts.addtime = new Date(this.posts.addtime)
        console.log(this.posts)
      } else if (cid) {
        this.act = 'cate'
        result = await this.$axios.$get('/api/posts/cate' + cid)
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
            this.$axios.post(url, params).then((res) => {
              if (res.id) {
                this.$Message.info({
                  content: '添加成功',
                  duration: 2,
                  onClose: () => this.$router.push('./list')
                })
              }
            })
          } else {
            url = '/api/posts/update'
            this.$axios.post(url, params).then((res) => {
              if (res.rows > 0) {
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
