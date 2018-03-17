<template>
  <div class="noteslist">
    <div class="notestit">
      {{catename}}({{total}})
    </div>
    <ul>
      <li v-for="(note,index) in notes" :key="index" :class="{cur:noteid==note.id}" @click="selectNote(note)">
        <p class="itemtitle" :title="note.title">
          {{note.title}}
        </p>
      </li>
    </ul>
    <p class="loading" v-show="total>notes.length" v-loading="isloading" @click="loadingnext()">
      加载更多...
    </p>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  props: ['cateid', 'noteid', 'catename'],
  data() {
    return {
      isloading: false,
      notes: [],
      pageSize: 20,
      pageNum: 1,
      total: 0
    }
  },
  created() {
    this.getData()
    this.$on('updatenotes', () => {
      this.pageNum = 1
      this.notes = []
      this.getData()
    })
  },
  watch: {
    cateid(newval, oldval) {
      this.pageNum = 1
      this.notes = []
      this.getData(newval)
    }
  },
  methods: {
    async getData(cid) {
      var url = '/api/notes/list'
      url += '?pageNum=' + this.pageNum
      url += '&pageSize=' + this.pageSize
      if (cid !== undefined) {
        url += '&cid=' + cid
      } else if (this.cateid !== 0) {
        url += '&cid=' + this.cateid
      }
      let notesresult = await axios.get(url)
      this.total = notesresult.data.total
      this.notes.push(...notesresult.data.data)
    },
    loadingnext() {
      this.pageNum = this.pageNum + 1
      this.getData()
    },
    selectNote(note) {
      this.$emit('update:noteid', note.id)
    }
  }
}
</script>
<style scoped>
.notestit{
  background-color: #eee;
  border-bottom: 1px solid #ebeff2;
  height: 36px;
  line-height: 36px;
  padding: 0 10px;
}
.noteslist ul, .noteslist li{
  list-style: none;
}
.noteslist ul{
  padding: 0;
  margin: 5px 0;
}
.noteslist li{
  height: 30px !important;
  border: 0;
  border-radius: 0;
  border-bottom: 1px solid #ebeff2;
  padding: 0 0 0 5px;
}
.noteslist li.cur{
  background-color: #eee;
}
.noteslist li:hover{
  background-color: #eee;
}
.itemtitle{
  font-size: 16px;
  line-height: 30px;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
}
.loading{
  text-align: center;
  font-size: 14px;
  margin-bottom: 5px;
  cursor: pointer;
}
</style>
