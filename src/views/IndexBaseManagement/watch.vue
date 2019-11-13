<template>
  <div v-show="fLagd">
    <div>子页面显示</div>
    <el-button
      type="text"
      size="mini"
      @click="hidePanel"
    >
      上一步
    </el-button>
  </div>
</template>

<script>
export default {
  name: "watch",
  props: ['fLagd'],
  data() {
    return {
    }
  },
  methods: {
    hidePanel() {
      // 下面的语句配合开头写的 .sync 就会更新父组件中的 panelShow 变量
      this.$emit('update:fLagd', false)  //弹框隐藏，意为panelShow为false
    }
  }
}
</script>

<style scoped>

</style>
