<template>
  <div class="noteslist">
    <ul>
      <li v-for="note in notes" :key="note.id" :class="{cur:noteid==note.id}" @click="selectNote(note)">
        <p class="itemtitle">
          {{note.title}}
        </p>
      </li>
    </ul>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  props: ['cateid', 'noteid'],
  data() {
    return {
      notes: [],
      pageSize: 20,
      pageNum: 0,
      total: 0
    }
  },
  watch: {
    cateid(newval, oldval) {
      this.pageNum = 0
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
    getNextData() {

    },
    selectNote(note) {
      this.$emit('update:noteid', note.id)
    }
  }
}
</script>
<style scoped>
.noteslist li{
  height: 30px !important;
  border: 0;
  border-radius: 0;
  border-bottom: 1px solid #ebeff2;
  margin: 0 -5px;
}
.itemtitle{
  font-size: 16px;
  height: 22px;
}
</style>
