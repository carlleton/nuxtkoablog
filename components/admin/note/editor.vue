<template>
  <div class="form">
    <div class="formtit">
      <el-input size="small" placeholder="标签" class="inputtags" v-model="note.tags"></el-input>
      <div class="rightbtn">
        <i class="fa fa-edit" title="编辑" v-show="act=='show'" @click="actchange('edit')"></i>
        <i class="fa fa-eye" title="查看" v-show="act!='show'" @click="actchange('show')"></i>
        <i class="fa fa-save" @click="save" title="保存"></i>
      </div>
    </div>
    <el-input placeholder="请输入标题" v-model="note.title"></el-input>
    <div class="contentshow md" v-if="act=='show'" v-html="markdownhtml"></div>
    <mavon-editor class="editor" v-if="act!='show'" v-model="note.content"></mavon-editor>
    <div class="nonoteshow" v-if="act=='show' && noteid==0">
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
  props: ['cateid', 'noteid', 'act'],
  data() {
    return {
      note: {
        tags: '',
        title: '',
        content: '',
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
        this.$emit('update:act', 'show')
        this.getnote(newval)
      }
    }
  },
  created() {

  },
  methods: {
    async getnote(id) {
      let result = await axios.get('/api/notes/' + id)
      this.note = result.data
    },
    async save() {
      var params = {
        title: this.note.title,
        content: this.note.content,
        cid: this.note.cid,
        tags: this.note.tags,
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
              this.$emit('update:act', 'show')
              this.$emit('update:noteid', this.note.id)
              this.$emit('updatenotes')
            }
          })
        }
      } else {
        url = '/api/notes/update'
        notedata = await axios.post(url, params)
        if (notedata.data.rows > 0) {
          this.$message({
            message: '更新成功',
            duration: 2000,
            onClose: () => {
              this.$emit('update:act', 'show')
              this.$emit('updatenotes')
            }
          })
        }
      }
    },
    doadd() {
      this.$emit('update:act', 'add')
      this.note.id = 0
      this.note.tags = ''
      this.note.title = ''
      this.note.content = ''
      this.note.addtime = new Date()
    },
    actchange(tag) {
      this.$emit('update:act', tag)
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
