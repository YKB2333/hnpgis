<template>
  <ul id="rsMenu" class="fl">
    <li
      v-for="(item,idx) in menuArr"
      :key="idx"
      :class="{activeClass:curMenu==idx}"
      @click="jump(idx)"
    >{{item.title}}</li>
  </ul>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      menuArr: [
        {
          title: "首页",
          path: "/home"
        },
        {
          title: "地图应用",
          href: "http://www.pgis.hn/pgismap/index.html"
        },
        {
          title: "平台资源",
          path: "/terrace"
        },
        {
          title: "统计报表",
          path: "/report"
        },
        {
          title: "采集平台",
          href: "http://www.pgis.hn/collection/"
        },
        {
          title: "服务管理",
          href: "http://65.26.10.110:8800/"
        },
        {
          title: "监控平台",
          href: "http://www.pgis.hn/EzDataMonitorPlat_web"
        }
      ],
      curMenu: 0
    };
  },
  methods: {
    jump(idx) {
      this.curMenu = idx;
      if (this.menuArr[idx].href) {
        window.location.href = this.menuArr[idx].href;
      } else {
        this.$router.push(this.menuArr[idx].path);
      }
    }
  },
  created() {
    var curPath = this.$route.path;
    this.menuArr.map((item, idx) => {
      if (item.path == curPath) {
        this.curMenu = idx;
        //   console.log(this.curMenu)
      }
    });
  }
};
</script>
<style scoped lang="less">
#rsMenu {
    transform: scale(.6);
  display: inline-block;
  list-style: none;
  margin-left: 180px;
  margin-top:-60px;

  padding-top: 90px;
  li {
    position: relative;
    width: 239px;
    height: 80px;
    background: url("../../assets/images/hnimages/menu.png") no-repeat;
    text-align: center;
    margin-bottom: 9px;
    font-size: 24px;
    line-height: 80px;
    color: #55c2f9;
    cursor: pointer;
    &.activeClass {
      color: #f5d38a;
      background: url("../../assets/images/hnimages/activeMenu.png") no-repeat;
    }
    &:hover {
      background: url("../../assets/images/hnimages/activeMenu.png") no-repeat;
      color: #f5d38a;
    }
    a {
      text-decoration: none;
      color: #c0e5ff;
    }
  }
}
</style>

