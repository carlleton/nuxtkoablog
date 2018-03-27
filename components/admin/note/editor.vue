<template>
  <div class="form">
    <div class="formtit">
      <el-input placeholder="标签" class="inputtags" v-model="note.tags"></el-input>
      <el-checkbox class="ispost" v-model="isPost">发布到post</el-checkbox>
      <div class="rightbtn">
        <i class="fa fa-edit" title="编辑" v-show="act=='show'" @click="act='edit'"></i>
        <i class="fa fa-eye" title="查看" v-show="act!='show'" @click="act='show'"></i>
        <i class="fa fa-save" @click="save" title="保存"></i>
      </div>
    </div>
    <el-input placeholder="请输入标题" v-model="note.title"></el-input>
    <div class="contentshow md" v-if="act=='show'" v-html="markdownhtml"></div>
    <mavon-editor class="editor" v-if="act!='show'" v-model="note.content"></mavon-editor>
    <div class="nonoteshow" v-if="action=='' && noteid==0">
      <button @click="$emit('addNote')">添加笔记</button>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import hljs from 'highlight.js'
import 'highlight.js/styles/dark.css'
import '~/assets/css/yeh-md-theme.css'

let marked = require('marked')
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  highlight: function (code) {
    return hljs.highlightAuto(code).value
  }
})
export default {
  props: ['cateid', 'noteid', 'action'],
  data() {
    return {
      act: 'show',
      isPost: false,
      note: {
        tags: '',
        title: '',
        content: '',
        postid: '',
        addtime: new Date(),
        id: 0
      }
    }
  },
  computed: {
    markdownhtml() {
      return marked(this.note.content)
    }
  },
  watch: {
    cateid(newval, oldval) {
      this.note.cid = newval
    },
    noteid(newval, oldval) {
      if (newval === 0) {
        this.doadd()
      } else {
        this.act = 'show'
        this.getnote(newval)
      }
    },
    action(newval, oldval) {
      if (newval === 'add') {
        this.doadd()
      }
    }
  },
  created() {

  },
  methods: {
    async getnote(id) {
      let result = await axios.get('/api/notes/' + id)
      this.note = result.data
      this.isPost = !!this.note.postid
    },
    async save() {
      var params = {
        title: this.note.title,
        content: this.note.content,
        cid: this.note.cid,
        tags: this.note.tags,
        postid: this.note.postid,
        addtime: new Date(this.note.addtime).getTime(),
        id: this.note.id
      }
      var url = ''
      var notedata
      if (this.note.id === 0) {
        url = '/api/notes/add'
        notedata = await axios.post(url, params)
        if (notedata.data.id) {
          this.note.id = notedata.data.id
          this.$message({
            message: '添加成功',
            duration: 2000,
            onClose: () => {
              this.act = 'show'
              this.$emit('updatenotes')
            }
          })
          if (this.isPost) {
            this.addPost(this.note.id, params)
          }
        }
      } else {
        url = '/api/notes/update'
        notedata = await axios.post(url, params)
        if (notedata.data.rows > 0) {
          this.$message({
            message: '更新成功',
            duration: 2000,
            onClose: () => {
              this.act = 'show'
              this.$emit('updatenotes')
            }
          })
          if (this.isPost) {
            if (!this.note.postid) {
              this.addPost(this.note.id, params)
            } else {
              this.updatePost(this.note.postid, params)
            }
          } else if (this.note.postid) {
            this.deletePost(this.note.postid)
            url = '/api/notes/update'
            params = {
              id: this.note.id,
              postid: 0
            }
            notedata = await axios.post(url, params)
          }
        }
      }
    },
    async addPost(noteid, params) {
      params.cid = ''
      params.noteid = noteid
      var url = '/api/posts/add'
      var postdata = await axios.post(url, params)
      if (postdata.data.id) {
        this.note.postid = postdata.data.id
        url = '/api/notes/update'
        params.postid = this.note.postid
        var notedata = await axios.post(url, params)
        if (notedata.data.rows > 0) {
          this.$message({
            message: '添加到post成功',
            duration: 2000
          })
        }
      }
    },
    async updatePost(postid, params) {
      var url = '/api/posts/update'
      params = {
        id: postid,
        title: params.title,
        content: params.content,
        tags: params.tags
      }
      var postdata = await axios.post(url, params)
      if (postdata.data.rows > 0) {
        this.$message({
          message: '更新到post成功',
          duration: 2000
        })
      }
    },
    async deletePost(postid) {
      var url = '/api/posts/del'
      var params = {
        id: postid
      }
      var postdata = await axios.post(url, params)
      if (postdata.data.rows > 0) {
        this.$message({
          message: '删除post成功',
          duration: 2000
        })
      }
    },
    doadd() {
      this.act = 'add'
      this.note.id = 0
      this.note.tags = ''
      this.note.postid = ''
      this.note.title = ''
      this.note.content = ''
      this.note.addtime = new Date()
      this.isPost = false
    }
  }
}
</script>
<style scoped>
.form{
  height: 100%;
  width: 99%;
}
.inputtags{
  width: 500px;
}
.ispost{
  margin-left: 10px;
}
.rightbtn{
  float: right;
  line-height: 35px;
  margin-right: 10px;
}
.rightbtn i{
  cursor: pointer;
  margin-right: 10px;
  line-height: 35px;
}
.editor{
  height: calc(100% - 80px);
}
.contentshow{
  padding: 10px;
}
.nonoteshow{
  width: 300px;
  text-align: center;
}
</style>
