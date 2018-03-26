<template>
  <div class="contextmenu" :style="{left:point.x, top:point.y}">
    <ul>
      <li v-for="(menu,index) in menus" :key="index" @click="menu.fnHandler">
        <i :class="menu.ico||''"></i> {{menu.name}}
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: ['menus', 'point']
}
</script>
<style scoped>
.contextmenu{
  position: fixed;
  z-index: 999;
}
</style>
