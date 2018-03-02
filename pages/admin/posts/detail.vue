<template>
  <div>
    <div class="tabletit">
      <Breadcrumb name="breadcrumb" separator=">" class="left">
        <BreadcrumbItem>home</BreadcrumbItem>
        <BreadcrumbItem to="./list">内容列表</BreadcrumbItem>
        <BreadcrumbItem>{{this.title}}</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <Form ref="posts" :model="posts" :rules="ruleValidate" label-position="top" :label-width="0" style="overflow:auto;">
      <div style="width:800px;float:left;">
        <FormItem label="标题" prop="title">
          <Input v-model="posts.title" :disabled="act=='cate'"></Input>
        </FormItem>
        <FormItem label="内容">
          <mavon-editor v-model="posts.content"></mavon-editor>
        </FormItem>
        <FormItem label="关键词" prop="tags">
          <Input v-model="posts.tags"></Input>
        </FormItem>
      </div>
      <div style="width:200px;float:left;margin-left:10px;">
        <FormItem label="分类" prop="cid" v-if="act!='cate'">
          <Select v-model="posts.cid" style="width:150px;">
            <Option value="0">未分类</Option>
            <Option v-for="cate in cates" :value="cate.id" :key="cate.id">
              {{cateshow(cate.path)}}{{cate.catename}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="状态" prop="status">
          <Select v-model="posts.status">
              <Option value="published">发布</Option>
              <Option value="draft">草稿</Option>
              <Option value="disabled">禁用</Option>
          </Select>
        </FormItem>
        <FormItem label="添加时间" prop="addtime">
          <DatePicker type="date" placeholder="Select date" v-model="posts.addtime"></DatePicker>
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
import axios from 'axios'
import _ from 'lodash'
import cates from '~/components/admin/cates'

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
      cid: '0',
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
      posts = result.data
    } else if (cid) {
      act = 'cate'
      result = await axios.get('/api/posts/cate' + cid)
      posts = result.posts
      title = '编辑' + posts.title
    } else {
      posts.addtime = Date.now()
      posts.cid = '0'
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
    cates
  }
}
</script>
<style scoped>

</style>
