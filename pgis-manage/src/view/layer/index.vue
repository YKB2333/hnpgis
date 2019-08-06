<template>
  <div>
    <Header />
    <div id="main">
      <div class="container">
        <Menu />
        <div id="dataBox">
          <div class="nav">
            <dl class="clearfix">
              <dt>数据来源</dt>
              <dd
                v-for="(item,idx) in sourceArr"
                :class="{'active':idx==curSource}"
                @click="jump(idx)"
              >{{item.type}}</dd>
            </dl>
            <div class="operateBox">
              <i
                v-for="(item,idx) in operateArr"
                :title="item.title"
                class="iconfont"
                :class="[item.type,{'active':idx==curOperate}]"
                @click="addClass(idx)"
              ></i>
              <i title="下载" class="iconfont iconxiazai"></i>
            </div>
            <!-- <dl class="type clearfix">
              <dt>类型</dt>
              <dd v-for="item in typeArr">{{item.type}}</dd>
            </dl>-->
            <i class="iconfont iconsousuo"></i>
            <input type="search" class="searchBox" placeholder="请输入图层的名称" />
          </div>
          <div class="gridShow" v-show="curOperate===1">
            <ul class="clearfix content">
              <li v-for="item in 50">
                <div>
                  <div class="clearfix">
                    <span class="fl place">学校</span>
                    <i class="iconfont icongongan fr"></i>
                  </div>
                  <div class="clearfix">
                    <span class="fl num">36879</span>
                    <span class="fr source">数据来源:治安</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div id="drag">
            <div class="bar"></div>
          </div>
          <div class="tableBox tb tb1" v-show="curOperate===0">
            <Table
              :disabled-hover="false"
              :row-class-name="rowClassName"
              :columns="columns2"
              :data="data2"
              width="1034"
              :height="data1Height"
            ></Table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Header from "../../components/rs_header/rs_header";
import Menu from "../../components/rs_menu/rs_menu";
import "./layer.less";
export default {
  components: {
    Header,
    Menu
  },
  data() {
    return {
      sourceArr: [
        {
          idx: 0,
          type: "治安"
        },
        {
          idx: 1,

          type: "交警"
        },
        {
          idx: 2,

          type: "科信"
        },
        {
          idx: 3,

          type: "反恐"
        },
        {
          idx: 4,

          type: "禁毒"
        },
        {
          idx: 5,

          type: "经侦"
        },
        {
          idx: 6,

          type: "人口出入境管理局"
        },
        {
          idx: 7,

          type: "警令部"
        },
        {
          idx: 8,
          type: "督查"
        }
      ],
      operateArr: [
        {
          title: "列表展示",
          type: "iconliebiaozhanshi"
        },
        {
          title: "图格展示",
          type: "icontubiaozhanshi"
        }
      ],
      curSource: 0,
      curOperate: 0,
      columns2: [
        {
          title: "序号",
          key: "number",
          align: "center"
        },
        {
          title: "图层名称",
          key: "dataTypes",
          align: "left"
        },
        {
          title: "来源警种",
          key: "dataSources",
          align: "left"
        },
        {
          title: "数据总量",
          key: "dataSize",
          align: "left"
        },
        {
          title: "最新更新时间",
          key: "updateTime",
          align: "left"
        }
      ],
      data2: [
        {
          number: 1,
          dataTypes: "航片",
          dataSources: "国规委",
          dataSize: "3.5G",
          updateTime: "2018-09",
          cellClassName: {
            age: "demo-table-info-cell-age",
            address: "demo-table-info-cell-address"
          }
        },
        {
          number: 1,
          dataTypes: "航片",
          dataSources: "国规委",
          dataSize: "3.5G",
          updateTime: "2018-09",
          cellClassName: {
            age: "demo-table-info-cell-age",
            address: "demo-table-info-cell-address"
          }
        },

        {
          number: 1,
          dataTypes: "航片",
          dataSources: "国规委",
          dataSize: "3.5G",
          updateTime: "2018-09",
          cellClassName: {
            age: "demo-table-info-cell-age",
            address: "demo-table-info-cell-address"
          }
        },

        {
          number: 1,
          dataTypes: "航片",
          dataSources: "国规委",
          dataSize: "3.5G",
          updateTime: "2018-09",
          cellClassName: {
            age: "demo-table-info-cell-age",
            address: "demo-table-info-cell-address"
          }
        },
        {
          number: 1,
          dataTypes: "航片",
          dataSources: "国规委",
          dataSize: "3.5G",
          updateTime: "2018-09",
          cellClassName: {
            age: "demo-table-info-cell-age",
            address: "demo-table-info-cell-address"
          }
        },
        {
          number: 1,
          dataTypes: "航片",
          dataSources: "国规委",
          dataSize: "3.5G",
          updateTime: "2018-09",
          cellClassName: {
            age: "demo-table-info-cell-age",
            address: "demo-table-info-cell-address"
          }
        },
        {
          number: 1,
          dataTypes: "航片",
          dataSources: "国规委",
          dataSize: "3.5G",
          updateTime: "2018-09",
          cellClassName: {
            age: "demo-table-info-cell-age",
            address: "demo-table-info-cell-address"
          }
        },
        {
          number: 1,
          dataTypes: "航片",
          dataSources: "国规委",
          dataSize: "3.5G",
          updateTime: "2018-09",
          cellClassName: {
            age: "demo-table-info-cell-age",
            address: "demo-table-info-cell-address"
          }
        },
        {
          number: 1,
          dataTypes: "航片",
          dataSources: "国规委",
          dataSize: "3.5G",
          updateTime: "2018-09",
          cellClassName: {
            age: "demo-table-info-cell-age",
            address: "demo-table-info-cell-address"
          }
        }
      ],
      data1Height: ""
    };
  },
  methods: {
    jump(idx) {
      this.curSource = idx;
    },
    addClass(idx) {
      this.curOperate = idx;
      if (this.curOperate == 1) {
        this.initScroll();
      }
    },
    rowClassName: function(row, index) {
      if (index % 2 == 0) {
        return "ivu-table-stripe-even";
      } else return "ivu-table-stripe-odd";
    },
    getBoxHeight() {
      // return 200
      let offsetHeight = document.querySelector(".tb1");
      console.log(offsetHeight);
      if (offsetHeight <= 523) {
        return offsetHeight;
      } else {
        return 523;
      }
    },
    initScroll() {
      var self = this;
      var con = document.getElementsByClassName("content")[0];
      var gridShow = document.getElementsByClassName("gridShow")[0];
      var drag = document.getElementById("drag");
      var bar = document.getElementsByClassName("bar")[0];
      var t = 0;
      //对模拟滚动条所在的区域采用禁止鼠标选择区域，ie下貌似是onselectstart事件吧，将该事件屏蔽
      document.onselectstart = function() {
        return false;
      };

      bar.onmousedown = function(e) {
        var e = e || window.event;
        var oy = e.clientY - bar.offsetTop;
        document.onmousemove = function(e) {
          var e = e || window.event;
          t = e.clientY - oy;
          self.move(t, drag, bar, con, gridShow);
          window.onmousewheel = function() {
            return false;
          };
        };
      };
      document.onmouseup = function() {
        document.onmousemove = null;
        // window.onmousewheel = function() {
        //   return true;
        // };
      };
      self.mouseWheel(con, function(res) {
        if (res) {
          t += 10;
          self.move(t, drag, bar, con, gridShow);
          console.log(t);
        } else {
          t -= 10;
          self.move(t, drag, bar, con, gridShow);
        }
        if (t <= 0) {
          t = 0;
        } else if (t >= drag.offsetHeight - bar.offsetHeight) {
          t = drag.offsetHeight - bar.offsetHeight;
        }
      });
    },
    move(t, drag, hezi, con, news) {
      if (t <= 0) {
        t = 0;
      } else if (t >= drag.offsetHeight - hezi.offsetHeight) {
        t = drag.offsetHeight - hezi.offsetHeight;
      }
      var bilv = t / (drag.offsetHeight - hezi.offsetHeight);
      con.style.top = -bilv * (con.offsetHeight - news.offsetHeight) + "px";
      hezi.style.top = t + "px";
    },
    mouseWheel(obj, callback) {
      //获取是不是firefox浏览器
      var ff = navigator.userAgent.indexOf("Firefox");
      if (ff != -1) {
        obj.addEventListener("DOMMouseScroll", wheel, false);
      } else {
        //IE,谷歌
        obj.onmousewheel = wheel;
      }
      function wheel(e) {
        var e = e || window.event;
        var down = true;
        if (e.detail) {
          //firefox相反
          down = e.detail > 0;
        } else {
          //ie 谷歌  规定：大于0 上滚，小于0下滚
          down = e.wheelDelta < 0;
        }
        // console.log(down);向下滚时为true,向上滚时为false
        callback(down);
      }
    }
  },
  mounted() {
    this.data1Height = this.getBoxHeight();
  }
};
</script>
<style scoped lang="less">
#dataBox {
  position: relative;
}
.nav {
  position: relative;
  width: 1073px;
  height: 92px;
  background: url("../../assets/images/hnimages/layerNav.png") no-repeat;
  background-size: 98% 106%;
  dl {
    font-size: 16px;
    color: #c0e5ff;
    padding: 20px 0 0 40px;
    dt,
    dd {
      float: left;
      margin-right: 62px;
      padding: 0 10px;
    }
    dt {
      height: 60px;
      cursor: default;
    }
    dd {
      cursor: pointer;
      margin-bottom: 8px;
      &.active {
        background-image: linear-gradient(0deg, #1771af 0%, #3daefc 100%);
        box-shadow: 0px 0px 5px 0px rgba(163, 246, 248, 0.85);
      }
    }
  }
  .type {
    padding-top: 10px;
    dt {
      letter-spacing: 32px;
      margin-right: 8px;
    }
    dd {
      margin-right: 60px;
    }
  }
  .operateBox,
  .searchBox {
    position: absolute;
    right: 38px;
    top: 18px;
    i {
      margin-right: 30px;
      font-size: 22px;
      color: #c0e5ff;
      &:active {
        color: #3daefc;
      }
    }
    i.active {
      color: #3daefc;
    }
  }
  .searchBox {
    right: 52px;
    top: 60px;
    width: 150px;
    height: 22px;
    padding-left: 22px;
    border: 1px solid #c0e5ff;
    background-color: transparent;
    font-size: 10px;
    color: #c0e5ff;
    opacity: 0.8;
    &::-webkit-input-placeholder {
      /* placeholder颜色  */
      color: #c0e5ff;
      /* placeholder字体大小  */
      font-size: 10px;
      /* placeholder位置  */
      text-align: left;
      opacity: 0.8;
    }
  }
  .iconsousuo {
    position: absolute;
    right: 182px;
    top: 61px;
    font-size: 14px;
    color: #c0e5ff;
    opacity: 0.8;
  }
}
.gridShow {
  position: relative;
  width: 1073px;
  height: 550px;
  overflow: hidden;
  margin-top: 20px;
  &::-webkit-scrollbar {
    display: none;
  }
  ul {
    position: absolute;
  }
  li {
    float: left;
    width: 240px;
    height: 166px;
    margin: 0 11px 20px 11px;
    border: 1px solid #3daefc;
    background-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0px 0px 6px 0px rgba(116, 241, 255, 0.85);
    & > div {
      height: 127px;
      margin: 22px 30px;
      vertical-align: bottom;
      i {
        font-size: 38px;
        color: #fff;
        opacity: 0.1;
        margin-top: -10px;
      }
      span {
        &.place {
          color: #fff;
          font-size: 24px;
        }
        &.num {
          margin-top: 30px;
          color: #09ffff;
          font-size: 30px;
        }
        &.source {
          margin-top: 52px;

          color: #fff;
          font-size: 8px;
        }
      }
    }
  }
}
#drag {
  position: absolute;
  display: inline-block;
  width: 4px;
  height: 550px;
  box-sizing: content-box;
  top: 112px;
  right: 12px;
}
.bar {
  position: absolute;
  width: 4px;
  height: 20px;
  background: rgba(116, 241, 255, 0.85);
  border-radius: 5px;
}
.tb1 {
  margin: 20px 0 0 10px;
}
</style>

