<template>
  <ul id="rsMenu" class="fl">
    <li v-for="(item,idx) in menuArr" :key="idx" :class="{activeClass:curMenu==idx}" @click="jump(idx)">{{item.title}}</li>
  </ul>
</template>
<script>

export default {
  components: {
  },
  data () {
    return {
        menuArr : [{
            title : "首页",
            path : "/home"
        },{
            title : "地图应用",
            href :"http://65.26.10.45:8080/pgismap/index.html"
        },{
            title : "平台资源",
            path : "/terrace"
        },{
            title : "统计报表",
            path : "/report"
        },{
            title : "采集平台",
            href :"http://65.26.10.110:8080/collection/"
        },{
            title : "服务管理",
            href : "http://65.26.10.110:8800/"
        },{
            title : "监控平台",
            href : "http://65.26.10.162:8080/EzDataMonitorPlat_web"
        }],
        curMenu:0
    }
  },
  methods:{
      jump(idx){
          this.curMenu = idx;
          if(this.menuArr[idx].href){
              window.location.href=this.menuArr[idx].href
          }else{
              this.$router.push(this.menuArr[idx].path);
          }
      }
  },
  created(){
      var curPath = this.$route.path;
      this.menuArr.map((item,idx)=>{
          if(item.path==curPath){
              this.curMenu=idx
            //   console.log(this.curMenu)
          }
      })

  },

}
</script>
<style scoped lang="less">
#rsMenu{
    display:inline-block;
    list-style: none;
    margin-left:47px;
    padding-top:48px;
    li{
        position:relative;
        width:141px;
        height:34px;
        background-color:#174B73;
        margin-top:20px;
        text-align: center;
        font-size:18px;
        line-height:34px;
        color:#C0E5FF;
        cursor: pointer;
        &:first-child{
            letter-spacing: 36px;
            text-align: right;
        }
        &.activeClass{
            background:url("../../assets/images/hnimages/activeMenu.png");
            &:before {
                border-color: transparent transparent transparent transparent;
            }
            &:after {
                border-color: transparent transparent transparent transparent;
            }
        }
        a{
            text-decoration: none;
        color:#C0E5FF;

        }
    }
    li:before {
        content: '';
        display: block;
        position: absolute;
        width: 0;
        height: 0;
        left:-12px;
        border-width: 17px 6px;
        border-style: solid;
        border-color: transparent #174B73 transparent transparent;
    }
    li:after {
        content: '';
        display: block;
        position: absolute;
        width: 0;
        height: 0;
        top:0;
        right:-12px;
        border-width: 17px 6px;
        border-style: solid;
        border-color: transparent  transparent transparent #174B73;
    }
}
</style>

