<template>
  <div class="cates">
    <ul>
        <li v-for="cate in cates" :key="cate.id">
          <template v-if="cate.childs">
            <i class="fa fa-plus-square-o" v-show="!cate.childshow" @click="cate.childshow=true"></i>
            <i class="fa fa-minus-square-o" v-show="cate.childshow" @click="cate.childshow=false"></i>
          </template>
          <i class="catename" v-else></i>
          {{cate.catename}}
            <ul v-if="cate.childs && cate.childs.length > 0" v-show="cate.childshow">
              <li v-for="child in cate.childs" :key="child.id">
                {{child.catename}}
              </li>
            </ul>
        </li>
      </ul>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  props: [],
  data() {
    return {
      cates: []
    }
  },
  created() {
    this.getCatesData()
  },
  methods: {
    async getCatesData() {
      let catesresult = await axios.get('/api/notecates/list')
      var data = catesresult.data
      var cates = []
      var temps = []
      for (var i = 0, n = data.length; i < n; i++) {
        if (data[i].pid === 0) {
          cates.push(data[i])
        } else {
          var maxi = cates.length - 1
          if (data[i].pid === cates[maxi].id) {
            if (cates[maxi].childs === undefined) {
              cates[maxi].childshow = false
              cates[maxi].childs = []
            }
            cates[maxi].childs.push(data[i])
          } else {
            temps.push(data[i])
          }
        }
      }
      this.cates = cates.concat(temps)
    }
  }
}
</script>
<style scoped>
.cates ul, .cates li{
  list-style: none;
}
.cates li{
  line-height: 25px;
}
.cates .catename{
  width: 10px;
  display: inline-block;
}
.cates ul{
  padding-left: 20px;
}
</style>
