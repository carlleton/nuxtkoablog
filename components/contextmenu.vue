<template>
  <div class="contextmenu" :style="{left:point.x+'px', top:(point.y+5)+'px'}" v-if="isShow">
    <ul>
      <li v-for="(menu,index) in menus" :key="index" @click="menu.fnHandler">
        <i :class="menu.ico||''"></i> {{menu.name}}
      </li>
    </ul>
    <div class="contextmenubg"></div>
  </div>
</template>
<script>
export default {
  props: ['menus', 'point', 'isShow'],
  mounted() {
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.$emit('update:isShow', false)
      }
    })
  }
}
</script>
<style scoped>
.contextmenu{
  position: fixed;
  z-index: 999;
  background: #fff;
}
.contextmenu ul{
  z-index: 1;
  box-shadow: 2px 2px 10px #888888;
}
.contextmenu li{
  padding: 5px 10px;
  color: #333;
  cursor: pointer;
}
.contextmenu li:hover{
  background: #ccc;
}
.contextmenubg{
  background: rgba(255,255,255,0.9);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>
