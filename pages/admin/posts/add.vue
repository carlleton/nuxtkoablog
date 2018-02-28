<template>
  <div>
    <div class="tabletit">
      <Breadcrumb name="breadcrumb" separator=">" class="left">
        <BreadcrumbItem>home</BreadcrumbItem>
        <BreadcrumbItem>内容列表</BreadcrumbItem>
        <BreadcrumbItem>添加</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <Form :model="posts" label-position="top" :label-width="0" style="overflow:auto;">
      <div style="width:800px;float:left;">
        <FormItem label="标题">
          <Input v-model="posts.title"></Input>
        </FormItem>
        <FormItem label="内容">
          <mavon-editor v-model="posts.content"></mavon-editor>
        </FormItem>
        <FormItem label="关键词">
          <Input v-model="posts.tags"></Input>
        </FormItem>
      </div>
      <div style="width:200px;float:left;margin-left:10px;">
        <FormItem label="分类">
          <Select v-model="posts.cid">
              <Option value="beijing">New York</Option>
              <Option value="shanghai">London</Option>
              <Option value="shenzhen">Sydney</Option>
          </Select>
        </FormItem>
        <FormItem label="状态">
          <Select v-model="posts.status">
              <Option value="published">发布</Option>
              <Option value="draft">草稿</Option>
              <Option value="disabled">禁用</Option>
          </Select>
        </FormItem>
        <FormItem label="添加时间">
          <DatePicker type="date" placeholder="Select date" v-model="posts.addtime"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit()">提交</Button>
        </FormItem>
      </div>
    </Form>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  layout: 'admin',
  head: {
    title: '添加内容'
  },
  data() {
    return {
      posts: {
        title: '',
        cid: 0,
        status: 'published',
        content: '',
        tags: '',
        addtime: ''
      }
    }
  },
  mounted() {
    this.posts.addtime = (new Date()).getTime()
  },
  methods: {
    handleSubmit() {
      var url = '/api/posts/add'
      var params = this.posts
      axios.post(url, params).then((res) => {
        if (res.data.id) {
          this.$Message.info({
            content: '添加成功',
            duration: 2,
            onClose: () => this.$router.push('./list')
          })
        }
      })
    }
  }
}
</script>
<style scoped>

</style>
