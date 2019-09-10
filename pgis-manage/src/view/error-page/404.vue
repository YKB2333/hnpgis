<template>
  <div>
    <h1>系统维护中,请稍后再试...</h1>
    <div><input type="button" value="返回" onclick="javascript:history.back(-1);"><input type="button" value="刷新" onclick="javascript:history.go(0);"></div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {},
  created() {
    console.log(this.$router)
  },
  computed: {},
  methods: {},
  mounted() {}
};
</script>
<style scoped lang="less">
h1{
      color: #fff;
    text-align: center;
    font-size: 50px;
    width: 100%;
    margin-top: 24%;
}
div{
  text-align: center;
}
input{
    width: 150px;
    height: 50px;
    margin: 10px 22px 173px 60px;
    font-size: 20px;
    background: #0a3682;
    color: #fff;
    border-radius:4px;
      opacity:.9;

    &:hover{
      opacity:1;
    }
}
</style>

