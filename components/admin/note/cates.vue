<template>
  <div class="cates" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.8)">
    <ul>
      <li v-for="cate in cates" :key="cate.id">
        <p :class="{cur:cateid==cate.id}" @click="selectcate(cate)" @contextmenu="showContextMenu(cate)" @dblclick.prevent.stop="changeEdit(cate)">
          <span>
            <template v-if="cate.childs">
              <i class="fa fa-plus-square-o" v-show="!cate.childshow" @click.stop="cate.childshow=true"></i>
              <i class="fa fa-minus-square-o" v-show="cate.childshow" @click.stop="cate.childshow=false"></i>
            </template>
            <i class="catename" v-else></i>
            <template v-if="!cate.edit">
              {{cate.catename}}
            </template>
            <template v-else>
              <input class="editbox" type="text" v-model="cate.catename" @blur="savename(cate)" @keyup.enter="savename(cate)" />
            </template>
          </span>
          <i class="fa fa-cog set" @click="showContextMenu(cate)" v-if="cate.id!=0"></i>
        </p>
          <ul v-if="cate.childs && cate.childs.length > 0" v-show="cate.childshow">
            <li v-for="child in cate.childs" :key="child.id" @contextmenu="showContextMenu(child)">
              <p :class="{cur:cateid==child.id}" @click="selectcate(child)">
              <span @dblclick.prevent="changeEdit(child)">
                <template v-if="!child.edit">
                  {{child.catename}}
                </template>
                <template v-else>
                  <input class="editbox" type="text" v-model="child.catename" @blur="savename(child)" @keyup.enter="savename(child)" />
                </template>
              </span>
              <i class="fa fa-cog set" @click="showContextMenu(child)"></i>
              </p>
            </li>
          </ul>
      </li>
    </ul>
    <contextmenu ref="contextmenu" :point="contextmenuData.point" :menus="contextmenuData.menus" :isShow.sync="contextmenuData.isShow"></contextmenu>
  </div>
</template>
<script>
import axios from 'axios'
import contextmenu from '~/components/contextmenu'

export default {
  props: ['cateid', 'catename'],
  data() {
    return {
      loading: false,
      cates: [],
      contextmenuData: {
        point: {},
        menus: [],
        isShow: false
      }
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
      this.loading = true
      let catesresult = await axios.get('/api/notecates/list')
      var data = catesresult.data
      var cates = []
      var temps = []
      for (var i = 0, n = data.length; i < n; i++) {
        data[i].edit = false
        data[i].oldcatename = data[i].catename
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
      this.loading = false
    },
    // 选择某一项
    selectcate(cate) {
      this.$emit('update:cateid', cate.id)
      this.$emit('update:catename', cate.catename)
    },
    // 右键菜单
    showContextMenu(cate) {
      event.preventDefault()
      event.stopPropagation()
      if (cate.id === 0) {
        return
      }
      var x = event.clientX
      var y = event.clientY
      this.contextmenuData.point = {
        x: x,
        y: y
      }
      this.contextmenuData.menus = [
        {
          name: '上移',
          ico: 'fa fa-arrow-up',
          fnHandler: () => {
            this.do_up(cate)
            this.contextmenuData.isShow = false
          }
        },
        {
          name: '下移',
          ico: 'fa fa-arrow-down',
          fnHandler: () => {
            this.do_down(cate)
            this.contextmenuData.isShow = false
          }
        },
        {
          name: '删除',
          ico: 'fa fa-remove',
          fnHandler: () => {
            this.$confirm('您确认要删除吗？如有下级菜单将级联删除', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.contextmenuData.isShow = false
              this.do_del(cate)
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '取消删除'
              })
            })
          }
        }
      ]
      this.contextmenuData.isShow = true
    },
    // 上移
    async do_up(cate) {
      if (cate.orderid === 1) {
        this.$message({
          type: 'info',
          message: '已经是第一个，不需要上移了'
        })
        return
      }
      this.loading = true
      var url = '/api/notecates/up'
      var params = {
        id: cate.id
      }
      let res = await axios.post(url, params)
      if (res.data.rows > 0) {
        this.$message({
          type: 'success',
          message: '更新' + res.data.rows + '条'
        })
        this.getCatesData()
      } else {
        console.log(res.data)
        this.$message({
          type: 'error',
          message: '无法上移'
        })
      }
      this.loading = false
    },
    // 下移
    async do_down(cate) {
      this.loading = true
      var url = '/api/notecates/down'
      var params = {
        id: cate.id
      }
      let res = await axios.post(url, params)
      if (res.data.rows > 0) {
        this.$message({
          type: 'success',
          message: '更新' + res.data.rows + '条'
        })
        this.getCatesData()
      } else {
        console.log(res.data)
        this.$message({
          type: 'error',
          message: '无法下移'
        })
      }
      this.loading = false
    },
    // 删除操作
    async do_del(cate) {
      this.loading = true
      var url = '/api/notecates/del'
      var params = {
        id: cate.id
      }
      let res = await axios.post(url, params)
      if (res.data.rows > 0) {
        this.$message({
          type: 'success',
          message: '删除' + res.data.rows + '条'
        })
        this.getCatesData()
      } else {
        console.log(res.data)
        this.$message({
          type: 'error',
          message: '删除失败'
        })
      }
      this.loading = false
    },
    // 名称更改后自动保存
    async savename(cate) {
      if (cate.oldcatename === cate.catename) {
        cate.edit = false
        return
      }
      var url = '/api/notecates/update'
      var params = {
        catename: cate.catename,
        id: cate.id
      }
      axios.post(url, params).then((res) => {
        if (res.data.rows > 0) {
          this.$message({
            message: '更新成功',
            duration: 2000
          })
          cate.oldcatename = cate.catename
          cate.edit = false
        }
      })
    },
    changeEdit(cate) {
      if (cate.id !== 0) {
        cate.edit = true
      }
    }
  },
  components: {
    contextmenu
  },
  directives: {
    focus: {
      inserted: function (el, {value}) {
        el.focus()
      }
    }
  }
}
</script>
<style scoped>
.cates{
  background-color: #37485e;
}
.cates li{
  line-height: 35px;
  border-bottom: 1px solid transparent;
  border-color: rgba(255, 255, 255, 0.05);
}
.cates li p{
  color: #ADBECE;
  padding-left: 10px;
  line-height: 35px;
  display: block;
  cursor: pointer;
  background-color: transparent;
  display: flex;
}
.cates li i{
  line-height: 35px;
}
.cates li span{
  flex: 1;
}
.cates li ul li p{
  padding-left: 30px;
}
.cates li p:hover, .cates li a.cur{
  border-radius: 3px;
  color: #fff;
}
.cates li p.cur{
  background-color: #191D2B;
  border: 0;
}
.cates li p:hover{
  background-color: rgba(0, 0, 0, 0.3);
}
.cates li p .set{
  display: none;
  margin-right: 5px;
  line-height: 35px;
  opacity: 0.8;
}
.cates li p:hover .set{
  display: inline-flex;
}
.cates .catename{
  width: 10px;
  display: inline-block;
}
.editbox{
  line-height: 35px;
  border: 0;
  outline: none;
  width: 80%;
  background: #191D2B;
  color: #fff;
  padding: 0 5px;
}

</style>
