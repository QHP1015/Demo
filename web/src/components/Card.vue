<template>
  <div class="card p-3 bg-white mt-3">
    <div class="card-header d-flex ai-center pb-3">
      <i class="iconfont" :class="`icon-${icon}`"></i>
      <div class="fs-xl flex-1 pl-2">{{title}}</div>
      <i class="iconfont icon-menu"></i>
    </div>
    <div class="card-body pt-3">
        <!-- 插槽，定义一个预留的位置 -->
        <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
    props:{
        title:{type:String, require:true},
        icon:{type:String, require:true},
    }
};
</script>

<style lang="scss">
@import '../assets/scss/_variables.scss';
.card{
    border-bottom: 1px solid $border-color;
    .card-header{
        border-bottom: 1px solid $border-color;
    }
}
</style>
