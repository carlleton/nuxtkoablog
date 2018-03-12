<template>
  <div class="cates">
    <ul>
      <li v-for="cate in cates" :key="cate.id">
        <a :class="{cur:cateid==cate.id}" @click="selectcate(cate)">
          <template v-if="cate.childs">
            <i class="fa fa-plus-square-o" v-show="!cate.childshow" @click="cate.childshow=true"></i>
            <i class="fa fa-minus-square-o" v-show="cate.childshow" @click="cate.childshow=false"></i>
          </template>
          <i class="catename" v-else></i>
          {{cate.catename}}
        </a>
          <ul v-if="cate.childs && cate.childs.length > 0" v-show="cate.childshow">
            <li v-for="child in cate.childs" :key="child.id">
              <a :class="{cur:cateid==child.id}" @click="selectcate(child)">{{child.catename}}</a>
            </li>
          </ul>
      </li>
    </ul>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  props: ['cateid', 'catename'],
  data() {
    return {
      cates: []
    }
  },
  created() {
    this.getCatesData()
    this.$on('selectFirstCate', () => {
      var cate = this.cates[1]
      this.selectcate(cate)
    })
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
      this.cates = [{
        id: 0,
        catename: '最新'
      }].concat(cates.concat(temps))
    },
    selectcate(cate) {
      this.$emit('update:cateid', cate.id)
      this.$emit('update:catename', cate.catename)
    }
  }
}
</script>
<style scoped>
.cates{
  background-color: #37485e;
}
.cates ul, .cates li{
  list-style: none;
}
.cates ul{
  padding: 0;
  margin: 0;
}
.cates li{
  line-height: 35px;
  border-bottom: 1px solid transparent;
  border-color: rgba(255, 255, 255, 0.05);
}
.cates li a{
  color: #ADBECE;
  padding-left: 20px;
  display: block;
  cursor: pointer;
  background-color: transparent;
}
.cates li ul li a{
  padding-left: 40px;
}
.cates li a:hover, .cates li a.cur{
  border-radius: 3px;
  color: #fff;
}
.cates li a.cur{
  background-color: #191D2B;
  border: 0;
}
.cates li a:hover{
  background-color: rgba(0, 0, 0, 0.3);
}
.cates .catename{
  width: 10px;
  display: inline-block;
}

</style>
