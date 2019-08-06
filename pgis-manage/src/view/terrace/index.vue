<template>
  <div>
    <Header />
    <div id="main">
      <div class="container">
        <Menu />
        <div id="dataBox">
          <div class="nav">
            <ul class="clearfix">
              <li
                v-for="(item,idx) in sourceArr"
                :class="{'active':idx==curSource}"
                @click="jump(idx,item.lxid)"
                :key="idx"
              >{{item.type}}</li>
            </ul>
            <ul class="clearfix st" v-show="status.state">
              <li>数据来源</li>
              <li
                v-for="(item,idx) in sourceArr[status.idx].sourceType"
                :class="{'active':idx==curType}"
                @click="jump2(idx,item.lxid)"
                :key="idx"
              >{{item.name}}</li>
            </ul>
            <ul class="clearfix st" v-if="curSource===6">
              <li>市州</li>
              <li
                v-for="(item,idx) in sourceArr[5].sourceType"
                :class="{'active':idx==curType}"
                @click="jump3(idx,item.sz)"
                :key="idx"
              >{{item.szmc}}</li>
              <!-- @click="jump2(idx,item.lxid)" -->
            </ul>
            <div class="operateBox" v-if="curSource!=6">
              <i
                v-for="(item,idx) in operateArr"
                :title="item.title"
                class="iconfont"
                :class="[item.type,{'active':idx==curOperate}]"
                @click="addClass(idx)"
                :key="idx"
              ></i>
              <i title="下载" class="iconfont iconxiazai"></i>
            </div>
            <div class="operateBox">
              <i class="iconfont iconxiazai" title="下载"></i>
            </div>
            <i class="iconfont iconsousuo" v-if="curSource!=6"></i>
            <input
              type="search"
              class="searchBox"
              v-model="inputVal"
              placeholder="请输入图层的名称"
              v-if="curSource!=6"
              @keyup.enter="sousuo"
            />
          </div>

          <!-- 地理数据 -->
          <div class="dataTableBox" v-show="curSource==6">
            <div class="content2">
              <h2>警用基础地理信息数据</h2>
              <div class="dataTable">
                <h3>1.矢量数据</h3>
                <div class="tableBox tb">
                  <!-- <Scroll
                    :on-reach-bottom="moreLoad"
                    :distance-to-edge="offset"
                    :loading-text="loadingText"
                    :height="280"
                  >-->
                  <Table
                    :disabled-hover="false"
                    :row-class-name="rowClassName"
                    :columns="columns1"
                    :data="data1"
                    width="1034"
                    :height="data5Height"
                  ></Table>
                  <!-- </Scroll> -->
                  <!-- :height="180" 高度要自适应-->
                </div>

                <h3>2.影像数据</h3>
                <div class="tableBox tb">
                  <Table
                    :disabled-hover="false"
                    :row-class-name="rowClassName"
                    :columns="columns2"
                    :data="data2"
                    width="1034"
                    :height="data5Height"
                  ></Table>
                </div>
                <h3>3.矢影数据</h3>
                <div class="tableBox tb">
                  <Table
                    :disabled-hover="false"
                    :row-class-name="rowClassName"
                    :columns="columns4"
                    :data="data4"
                    width="1034"
                    :height="data5Height"
                  ></Table>
                </div>
              </div>
            </div>
          </div>
          <!-- 滚动条 -->
          <div id="drag2" v-show="curSource===6">
            <div class="bar2"></div>
          </div>
          <!-- <div class="floHead clearfix" v-show="curOperate===0&&responsePages>1">
            <div v-for="item in columns3" class="comprise fl">{{item.title}}</div>
          </div>-->
          <Layer
            :data3="data3"
            :columns3="columns3"
            :curOperate="curOperate"
            :scrollStatus="scrollStatus"
            v-show="curSource!=6"
            :moreLoad="moreLoad"
            :changePage="changePage"
            :responseTotal="responseTotal"
            :curPage="curPage"
            :loadingText="loadingText"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Header from "../../components/rs_header/rs_header";
import Menu from "../../components/rs_menu/rs_menu";
import "./iterrace.less";
import Layer from "./layer/index.vue";
import { setTimeout } from "timers";
var config = {
  pageSize: 10, //列表数据每页几条
  ps: 44 //图格数据每页几条
};
export default {
  components: {
    Header,
    Menu,
    Layer
  },
  data() {
    return {
      offset: 14,
      sourceArr: [
        {
          lxid: 0,
          type: "基础",
          eng: "base",
          sourceType: [
            {
              idx: 0,
              name: "全部"
            }
          ]
        },
        {
          lxid: 6,
          type: "地图数据",
          sourceType: [
            {
              idx: 0,
              szmc: "全部"
            }
          ]
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
      scrollStatus: false,
      status: { idx: 0, state: true },
      curSource: 0,
      curType: 0,
      curOperate: 0,
      inputVal: "",
      //当前的dataType
      curdataType: 1,

      responseTotal: "", //请求回的数据总量
      curPage: 1, //列表的当前页数
      currentPage: 1, //图格的当前页数
      pages: "", //图格的页数量
      loadingText: "数据加载中",

      sz: "", //当前市州
      slLoadingStatus: true, //滚动加载节流状态
      slcurPage: 1,
      data1Pages: "",

      yxLoadingStatus: true, //滚动加载节流状态
      yxcurPage: 1,
      data2Pages: "",

      syLoadingStatus: true, //滚动加载节流状态
      sycurPage: 1,
      data4Pages: "",
      //矢量数据
      columns1: [
        {
          title: "序号",
          key: "number",
          align: "center"
        },
        {
          title: "城市",
          key: "cityName",
          align: "center"
        },
        {
          title: "比例尺",
          key: "scale",
          align: "center"
        },
        {
          title: "数据来源",
          key: "dataSourece",
          align: "center"
        },
        {
          title: "获取方式",
          key: "access",
          align: "center"
        },
        {
          title: "更新时间",
          key: "lastUpdateTime",
          align: "center"
        },
        {
          title: "地图级别",
          key: "mapLevel",
          align: "center"
        },
        // {
        //   title: "图层数",
        //   key: "layerNumber",
        //   align: "center"
        // },
        // {
        //   title: "图元数",
        //   key: "primCounts",
        //   align: "center"
        // },
        {
          title: "数据量",
          key: "dataVolume",
          align: "center"
        },
        {
          title: "覆盖范围",
          key: "coverage",
          align: "center"
        },
        {
          title: "覆盖率",
          key: "coverageMode",
          align: "center"
        }
      ],
      data1Height: "",
      data1: [
        {
          number: 1,
          cityName: "长沙",
          scale: "1:500",
          dataSourece: "国规委",
          access: "免费共享",
          lastUpdateTime: "2018-09",
          mapLevel: 7,
          layerNumber: 4852323,
          primCounts: 18,
          dataVolume: "3.5G",
          coverage: "全境区域",
          coverageMode: "100%",
          cellClassName: {
            age: "demo-table-info-cell-age",
            address: "demo-table-info-cell-address"
          }
        }
      ],
      //影像数据
      columns2: [
        {
          title: "序号",
          key: "number",
          align: "center"
        },
        {
          title: "城市",
          key: "cityName",
          align: "center"
        },
        // {
        //   title: "分辨率",
        //   key: "dpi",
        //   align: "center"
        // },
        // {
        //   title: "数据类型",
        //   key: "dataTypes",
        //   align: "center"
        // },
        {
          title: "数据来源",
          key: "dataSourece",
          align: "center"
        },
        {
          title: "获取方式",
          key: "access",
          align: "center"
        },
        {
          title: "数据量",
          key: "dataVolume",
          align: "center"
        },
        {
          title: "覆盖范围",
          key: "coverage",
          align: "center"
        },
        {
          title: "更新时间",
          key: "lastUpdateTime",
          align: "center"
        },
        {
          title: "地图级别",
          key: "mapLevel",
          align: "center"
        },
        {
          title: `覆盖率`,
          key: "coverageMode",
          align: "center"
        }
        // {
        //   title: `比例尺`,
        //   key: "scale",
        //   align: "center"
        // }
      ],
      data2: [
        {
          number: 1,
          cityName: "长沙",
          dpi: "0.6米",
          dataTypes: "航片",
          dataSourece: "国规委",
          access: "免费共享",
          dataVolume: "3.5G",
          coverage: "全境区域",
          lastUpdateTime: "2018-09",
          mapLevel: 7,
          coverageMode: "100%",
          scale: "1:500",
          cellClassName: {
            age: "demo-table-info-cell-age",
            address: "demo-table-info-cell-address"
          }
        },
        {
          number: 2,
          dpi: "0.6米",
          dataTypes: "航片",
          dataSources: "国规委",
          access: "免费共享",
          dataSize: "3.5G",
          cover: "全境区域",
          updateTime: "2018-09",
          coverage: "100%",
          cellClassName: {
            age: "demo-table-info-cell-age",
            address: "demo-table-info-cell-address"
          }
        }
      ],
      data2Height: "",
      //矢影数据
      columns4: [
        {
          title: "序号",
          key: "number",
          align: "center"
        },
        {
          title: "城市",
          key: "cityName",
          align: "center"
        },
        // {
        //   title: "分辨率",
        //   key: "dpi",
        //   align: "center"
        // },
        // {
        //   title: "数据类型",
        //   key: "dataTypes",
        //   align: "center"
        // },
        {
          title: "数据来源",
          key: "dataSourece",
          align: "center"
        },
        {
          title: "获取方式",
          key: "access",
          align: "center"
        },
        {
          title: "数据量",
          key: "dataVolume",
          align: "center"
        },
        {
          title: "覆盖范围",
          key: "coverage",
          align: "center"
        },
        {
          title: "更新时间",
          key: "lastUpdateTime",
          align: "center"
        },
        {
          title: "地图级别",
          key: "mapLevel",
          align: "center"
        },
        {
          title: `覆盖率`,
          key: "coverageMode",
          align: "center"
        }
        // {
        //   title: `比例尺`,
        //   key: "scale",
        //   align: "center"
        // }
      ],
      data4: [],
      data4Height: "",
      //公共,专用,基础
      data3: [
        // {
        //   number: 1,
        //   name: "航片",
        //   origin: "国规委",
        //   count: "3.5G",
        //   updateTime: "2018-09",
        //   cellClassName: {
        //     age: "demo-table-info-cell-age",
        //     address: "demo-table-info-cell-address"
        //   }
        // },
        // {
        //   number: 1,
        //   dataTypes: "航片",
        //   dataSources: "国规委",
        //   dataSize: "3.5G",
        //   updateTime: "2018-09",
        //   cellClassName: {
        //     age: "demo-table-info-cell-age",
        //     address: "demo-table-info-cell-address"
        //   }
        // },
      ],
      columns3: [
        {
          title: "序号",
          key: "number",
          align: "center"
        },
        {
          title: "图层名称",
          key: "name",
          align: "center"
        },
        {
          title: "图层数",
          key: "count",
          align: "center"
        },
        {
          title: "来源",
          key: "origin",
          align: "center"
        },
        {
          title: "更新时间",
          key: "updateTime",
          align: "center"
        }
      ],
      data3Height: ""
    };
  },

  methods: {
    //大类跳
    jump(idx, dataType) {
      this.curSource = idx;
      this.curPage = 1;
      this.curdataType = dataType;
      //重置curPage
      this.curPage = 1;
      if (this.curSource != 6) {
        if (this.curOperate === 0) {
          this.getSmallData({
            dataType: this.curdataType,
            pageSize: config.pageSize
          });
        }
        if (this.curOperate === 1) {
          this.getSmallData({
            dataType: this.curdataType,
            pageSize: config.ps
          });
        }
        //数据来源显示
        this.status.idx = idx;
        this.status.state = true;
        this.curType = 0;
        //   setTimeout(() => {
        //   this.data3Height = this.getBoxHeight("tb", 3,520);
        // }, 30);
        return;
      } else if (this.curSource == 6) {
        this.initScroll2();
        this.removeElement();
        this.getslData({
          city: this.sourceArr[5].sourceType[0].sz,
          pageSize: 10
        });
        this.getsyData({
          city: this.sourceArr[5].sourceType[0].sz,
          pageSize: 10
        });
        this.getyxData({
          city: this.sourceArr[5].sourceType[0].sz,
          pageSize: 10
        });
        // setTimeout(() => {
        //   this.data1Height = this.getBoxHeight("tb", 0, 280);
        //   this.data2Height = this.getBoxHeight("tb", 1, 280);
        //   this.data4Height = this.getBoxHeight("tb", 2, 280);
        // }, 30);
      }
      this.status.idx = idx;
      this.status.state = false;
    },
    //小类跳
    jump2(idx, dataType) {
      this.curType = idx;
      this.curPage = 1;
      this.curdataType = dataType;
      this.curPage = 1;
      if (this.curOperate === 0) {
        this.getSmallData({
          dataType: this.curdataType,
          pageSize: config.pageSize
        });
      }
      if (this.curOperate === 1) {
        this.getSmallData({ dataType: this.curdataType, pageSize: config.ps });
      }
    },
    //地图小类跳
    jump3(idx, sz) {
      this.curType = idx;
      this.initScroll2();
      // console.log(sz);
      // this.getMapSmallData({ city: sz });
      this.removeElement();
      this.getslData({ city: sz, pageSize: 10 });
      this.getsyData({ city: sz, pageSize: 10 });
      this.getyxData({ city: sz, pageSize: 10 });
    },
    //改变列表样式
    addClass(idx) {
      this.curOperate = idx;
      if (idx === 0) {
        this.getSmallData({
          dataType: this.curdataType,
          pageSize: config.pageSize
        });
      }
      if (idx === 1) {
        this.getSmallData({ dataType: this.curdataType, pageSize: config.ps });
      }
      this.showGridScroll();
    },
    //图格表格滚动条显示与否
    showGridScroll() {
      if (this.curOperate == 1) {
        var con = document.getElementsByClassName("content")[0];
        setTimeout(() => {
          var conHeight = con.offsetHeight;
          con.style.top = 0 + "px";
          console.log(conHeight);
          if (conHeight > 560 || conHeight == 560) {
            this.scrollStatus = true;
          } else {
            this.scrollStatus = false;
          }
          // this.initScroll();
        }, 30);
      }
    },
    //图格表格自定义滚动条
    // initScroll() {
    //   var self = this;
    //   var con = document.getElementsByClassName("content")[0];
    //   var gridShow = document.getElementsByClassName("gridShow")[0];
    //   var drag = document.getElementById("drag");
    //   var bar = document.getElementsByClassName("bar")[0];
    //   var t = 0;
    //   var bilv = 0;

    //   //对模拟滚动条所在的区域采用禁止鼠标选择区域，ie下貌似是onselectstart事件吧，将该事件屏蔽
    //   document.onselectstart = function() {
    //     return false;
    //   };
    //   bar.style.top = 0 + "px"; //重新使bar在最上面
    //   bar.onmousedown = function(ev) {
    //     ev = ev || window.event;
    //     var oy = ev.clientY - bar.offsetTop;
    //     document.onmousemove = function(e) {
    //       e = e || window.event;
    //       t = e.clientY - oy;
    //       self.move(t, drag, bar, con, gridShow);
    //     };
    //   };
    //   document.onmouseup = function() {
    //     document.onmousemove = null;
    //   };
    //   self.mouseWheel(con, function(res) {
    //     if (res) {
    //       t += 10;
    //       self.move(t, drag, bar, con, gridShow,bilv);
    //       // console.log(t);
    //     } else {
    //       t -= 10;
    //       self.move(t, drag, bar, con, gridShow,bilv);
    //     }
    //     if (t <= 0) {
    //       t = 0;
    //     } else if (t >= drag.offsetHeight - bar.offsetHeight) {
    //       t = drag.offsetHeight - bar.offsetHeight;
    //     }
    //   });
    // },
    //地理数据自定义滚动条
    initScroll2() {
      var self = this;
      var con = document.getElementsByClassName("content2")[0];
      var gridShow = document.getElementsByClassName("dataTableBox")[0];
      var drag = document.getElementById("drag2");
      var bar = document.getElementsByClassName("bar2")[0];
      var t = 0;

      //对模拟滚动条所在的区域采用禁止鼠标选择区域，ie下貌似是onselectstart事件吧，将该事件屏蔽
      document.onselectstart = function() {
        return false;
      };
      bar.style.top = 0 + "px"; //重新使bar在最上面
      con.style.top = 0 + "px"; //使内容返回最上面
      bar.onmousedown = function(ev) {
        ev = ev || window.event;
        var oy = ev.clientY - bar.offsetTop;
        document.onmousemove = function(e) {
          e = e || window.event;
          t = e.clientY - oy;
          self.move(t, drag, bar, con, gridShow);
        };
      };
      document.onmouseup = function() {
        document.onmousemove = null;
      };
      self.mouseWheel(con, function(res) {
        if (res) {
          t += 20;
          self.move(t, drag, bar, con, gridShow);
          // console.log(t);
        } else {
          t -= 20;
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
        e = e || window.event;
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
    },
    //表格颜色
    rowClassName: function(row, index) {
      if (index % 2 == 0) {
        return "ivu-table-stripe-even";
      } else return "ivu-table-stripe-odd";
    },
    //定义地理数据表格的高度
    getBoxHeight(el, idx, height) {
      // return 200
      let offsetHeight = document.getElementsByClassName(el)[idx].offsetHeight;
      // console.dir(offsetHeight);
      // console.log(offsetHeight);
      if (offsetHeight <= height) {
        return offsetHeight;
      } else {
        return height;
      }
    },
    //调用大类接口
    getBigData() {
      var self = this;
      this.$axios
        .get(this.$config.baseUrl.dev + "/plat/baseData/type")
        .then(res => {
          let {
            data: { data, status }
          } = res;

          if (status === 1) {
            this.sourceArr = [];
            data.map((item, idx) => {
              var arr = {
                lxid: item.lxid,
                type: item.name,
                sourceType: [
                  {
                    idx: 0,
                    name: "全部",
                    lxid: item.lxid
                  }
                ]
              };
              for (var i = 0; i < item.children.length; i++) {
                // arr.sourceType.push(item.children[i]);
                arr.sourceType.push(item.children[i]);
              }
              this.sourceArr.push(arr);
            });
            this.sourceArr.push({
              lxid: 6,
              type: "地图数据",
              sourceType: [
                {
                  idx: 0,
                  szmc: "全部"
                }
              ]
            });
            this.getMapData();
          }
        });
    },

    //调用公共小类等接口  大类  小类  第几页  数量/页
    getSmallData({
      dataType = 24,
      page = 1,
      pageSize = 10,
      name = null,
      eventType = "click"
    }) {
      var url = this.$config.baseUrl.dev;
      // console.log(url)
      this.$axios
        .get(url + "/plat/baseData/type/list", {
          params: {
            dataType,
            page,
            pageSize,
            name
          }
        })
        .then(res => {
          let {
            data: { data, status }
          } = res;
          if (status === 1) {
            // console.log(data);
            this.responseTotal = data.total;
            // this.columns3 = [{{
            //   title: "序号",
            //   key: "number",
            //   align: "center"
            // },}]
            if (eventType == "click") {
              this.data3 = data.records.map((item, idx) => {
                var count = 0;
                if (item.tcs > 10000 && item.tcs < 100000) {
                  count = (item.tcs / 10000).toFixed(2) + "万";
                } else if (item.tcs > 100000 && item.tcs < 1000000) {
                  count = (item.tcs / 10000).toFixed(1) + "万";
                } else if (item.tcs > 1000000 && item.tcs < 10000000) {
                  count = parseInt(item.tcs / 10000) + "万";
                } else if (item.tcs > 10000000 && item.tcs < 100000000) {
                  count = (item.tcs / 10000000).toFixed(2) + "千万";
                } else {
                  count = item.tcs;
                }
                return {
                  number: item.lxid,
                  name: item.lxmc,
                  origin: item.flxmc,
                  count,
                  updateTime: item.gxsj,
                  cellClassName: {
                    age: "demo-table-info-cell-age",
                    address: "demo-table-info-cell-address"
                  }
                };
              });
              this.showGridScroll();
            }

            if (eventType == "scroll") {
              console.log(data.records);
              data.records.map((item, idx) => {
                var count = 0;
                if (item.tcs > 10000 && item.tcs < 100000) {
                  count = (item.tcs / 10000).toFixed(2) + "万";
                } else if (item.tcs > 100000 && item.tcs < 1000000) {
                  count = (item.tcs / 10000).toFixed(1) + "万";
                } else if (item.tcs > 1000000 && item.tcs < 10000000) {
                  count = parseInt(item.tcs / 10000) + "万";
                } else if (item.tcs > 10000000 && item.tcs < 100000000) {
                  count = (item.tcs / 10000000).toFixed(2) + "千万";
                } else {
                  count = item.tcs;
                }
                this.data3.push({
                  number: item.lxid,
                  name: item.lxmc,
                  origin: item.flxmc,
                  count,
                  updateTime: "2018-09",
                  cellClassName: {
                    age: "demo-table-info-cell-age",
                    address: "demo-table-info-cell-address"
                  }
                });
              });
            }

            this.pages = data.pages;

            // console.log(this.data3);
            //表格高度,如果数据大于10条,显示滚动条
            // if (data.records.length == 10) {
            //   // console.log(data.records.length);
            //   this.data3Height == 400;
            //   // console.log(this.data3Height);
            //   this.$forceUpdate();
            // }
          }
        });
    },
    //调用地图大类接口
    getMapData() {
      var url = this.$config.baseUrl.dev;
      //地图城市
      this.$axios.get(url + "/plat/ds").then(res => {
        let {
          data: { data, status }
        } = res;
        if (status === 1) {
          this.sourceArr[5].sourceType = data;
          // console.log(data[0].sz);
          // this.getMapSmallData(); //矢量
          this.getslData({ city: data[0].sz, pageSize: 10 });
          this.getsyData({ city: data[0].sz, pageSize: 10 });
          this.getyxData({ city: data[0].sz, pageSize: 10 });
        }
      });

      // this.$axios
      //   .get(url + "/plat/" + type, {
      //     params: {
      //       city,
      //       dataType,
      //       page,
      //       pageSize
      //     }
      //   })
      //   .then(res => {
      //     let {
      //       data: { data, status }
      //     } = res;
      //     if (status === 1) {
      //       // console.log(data);
      //       // this.columns3 = [{{
      //       //   title: "序号",
      //       //   key: "number",
      //       //   align: "center"
      //       // },}]
      //       if (dataType === 1) {
      //         this.data1 = data.records.map(
      //           (
      //             {
      //               cityName,
      //               scale,
      //               dataSourece,
      //               access,
      //               lastUpdateTime,
      //               mapLevel,
      //               dataVolume,
      //               coverage,
      //               coverageMode
      //             },
      //             idx
      //           ) => {
      //             return {
      //               number: 1,
      //               cityName,
      //               scale,
      //               dataSourece,
      //               access,
      //               lastUpdateTime,
      //               mapLevel,
      //               layerNumber: 4852323,
      //               primCounts: 18,
      //               dataVolume,
      //               coverage,
      //               coverageMode,
      //               cellClassName: {
      //                 age: "demo-table-info-cell-age",
      //                 address: "demo-table-info-cell-address"
      //               }
      //             };
      //           }
      //         );
      //       }
      //       if (dataType === 2 || dataType === 3) {
      //         this.data2 = data.records.map(
      //           (
      //             {
      //               cityName,
      //               scale,
      //               dataSourece,
      //               access,
      //               lastUpdateTime,
      //               mapLevel,
      //               dataVolume,
      //               coverage,
      //               coverageMode
      //             },
      //             idx
      //           ) => {
      //             return {
      //               number: 1,
      //               cityName,
      //               dpi: "0.6米",
      //               dataTypes: "航片",
      //               dataSourece,
      //               access,
      //               dataVolume,
      //               coverage,
      //               lastUpdateTime,
      //               mapLevel,
      //               coverageMode,
      //               scale,
      //               cellClassName: {
      //                 age: "demo-table-info-cell-age",
      //                 address: "demo-table-info-cell-address"
      //               }
      //             };
      //           }
      //         );
      //       }
      //       if (dataType === 3) {
      //         this.data4 = data.records.map(
      //           (
      //             {
      //               cityName,
      //               scale,
      //               dataSourece,
      //               access,
      //               lastUpdateTime,
      //               mapLevel,
      //               dataVolume,
      //               coverage,
      //               coverageMode
      //             },
      //             idx
      //           ) => {
      //             return {
      //               number: 1,
      //               cityName,
      //               dpi: "0.6米",
      //               dataTypes: "航片",
      //               dataSourece,
      //               access,
      //               dataVolume,
      //               coverage,
      //               lastUpdateTime,
      //               mapLevel,
      //               coverageMode,
      //               scale,
      //               cellClassName: {
      //                 age: "demo-table-info-cell-age",
      //                 address: "demo-table-info-cell-address"
      //               }
      //             };
      //           }
      //         );
      //       }
      //     }
      //   });
    },
    //调用地图小类接口
    //矢量
    getslData({
      city = null,
      page = 1,
      pageSize = 10,
      eventType = "click",
      el = null
    }) {
      this.sz = city;
      var url = this.$config.baseUrl.dev;
      this.$axios
        .get(url + "/plat/map/sl", {
          params: {
            city,
            page,
            pageSize
          }
        })
        .then(res => {
          let {
            data: { data, status }
          } = res;
          if (status === 1) {
            if (eventType === "click") {
              this.data1Pages = data.pages; //总页数
              this.slcurPage = data.current;
              // console.log(this.data1Pages,data.pages,this.slcurPage)
              this.data1 = data.records.map(
                ({ szmc, blc, ly, hqfs, gxsj, dj, sjl, fgfw, fgl }, idx) => {
                  return {
                    number: 1,
                    cityName: szmc,
                    scale: blc,
                    dataSourece: ly,
                    access: hqfs,
                    lastUpdateTime: gxsj,
                    mapLevel: dj,
                    // layerNumber: 4852323,
                    // primCounts: 18,
                    dataVolume: sjl + "G",
                    coverage: fgfw,
                    coverageMode: fgl,
                    cellClassName: {
                      age: "demo-table-info-cell-age",
                      address: "demo-table-info-cell-address"
                    }
                  };
                }
              );
            }
            if (eventType === "scroll") {
              console.log(this.slcurPage, this.data1Pages);
              this.data1Pages = data.pages; //总页数
              this.slcurPage = data.current;
              console.log(data.records);
              if (data.records.length > 0) {
                //为真时删除加载框,加载状态设置为true
                console.log(el.parentElement, this.slLoadingStatus);
                setTimeout(() => {
                  el.parentElement.removeChild(el);
                  data.records.map(
                    (
                      { szmc, blc, ly, hqfs, gxsj, dj, sjl, fgfw, fgl },
                      idx
                    ) => {
                      this.data1.push({
                        number: 1,
                        cityName: 1,
                        scale: 1,
                        dataSourece: 1,
                        access: 1,
                        lastUpdateTime: 1,
                        mapLevel: 1,
                        // layerNumber: 4852323,
                        // primCounts: 18,
                        dataVolume: 1,
                        coverage: 1,
                        coverageMode: 1,
                        cellClassName: {
                          age: "demo-table-info-cell-age",
                          address: "demo-table-info-cell-address"
                        }
                      });
                    }
                  );
                }, 1000);
                setTimeout(() => {
                  this.slLoadingStatus = true;
                }, 2000);
                // setTimeout(()=>{
                //   el.parentElement.removeChild(el);
                //   this.slLoadingStatus = true;
                //   return;
                // },10000)
              } else if (data.records.length == 0) {
                // this.slLoadingStatus = false;
                el.innerText = "数据加载完毕";
              }
            }
          }
        });
    },
    //矢量
    getyxData({
      city = null,
      page = 1,
      pageSize = 10,
      eventType = "click",
      el = null
    }) {
      this.sz = city;
      var url = this.$config.baseUrl.dev;
      this.$axios
        .get(url + "/plat/map/yx", {
          params: {
            city,
            page,
            pageSize
          }
        })
        .then(res => {
          let {
            data: { data, status }
          } = res;
          if (status === 1) {
            if (eventType === "click") {
              this.data2Pages = data.pages; //总页数
              this.yxcurPage = data.current;
              // console.log(this.data1Pages,data.pages,this.slcurPage)
              this.data2 = data.records.map(
                ({ szmc, blc, ly, hqfs, gxsj, dj, sjl, fgfw, fgl }, idx) => {
                  return {
                    number: 1,
                    cityName: szmc,
                    scale: blc,
                    dataSourece: ly,
                    access: hqfs,
                    lastUpdateTime: gxsj,
                    mapLevel: dj,
                    // layerNumber: 4852323,
                    // primCounts: 18,
                    dataVolume: sjl + "G",
                    coverage: fgfw,
                    coverageMode: fgl,
                    cellClassName: {
                      age: "demo-table-info-cell-age",
                      address: "demo-table-info-cell-address"
                    }
                  };
                }
              );
            }
            if (eventType === "scroll") {
              this.data2Pages = data.pages; //总页数
              this.yxcurPage = data.current;
              if (data.records.length > 0) {
                //为真时删除加载框,加载状态设置为true
                setTimeout(() => {
                  el.parentElement.removeChild(el);
                  data.records.map(
                    (
                      { szmc, blc, ly, hqfs, gxsj, dj, sjl, fgfw, fgl },
                      idx
                    ) => {
                      this.data2.push({
                        number: 1,
                        cityName: 1,
                        scale: 1,
                        dataSourece: 1,
                        access: 1,
                        lastUpdateTime: 1,
                        mapLevel: 1,
                        // layerNumber: 4852323,
                        // primCounts: 18,
                        dataVolume: 1 + "G",
                        coverage: 1,
                        coverageMode: 1,
                        cellClassName: {
                          age: "demo-table-info-cell-age",
                          address: "demo-table-info-cell-address"
                        }
                      });
                    }
                  );
                }, 1000);
                setTimeout(() => {
                  this.yxLoadingStatus = true;
                }, 2000);
              } else if (data.records.length == 0) {
                el.innerText = "数据加载完毕";
              }
            }
          }
        });
    },
    //矢影
    getsyData({
      city = null,
      page = 1,
      pageSize = 10,
      eventType = "click",
      el = null
    }) {
      this.sz = city;
      var url = this.$config.baseUrl.dev;
      this.$axios
        .get(url + "/plat/map/sy", {
          params: {
            city,
            page,
            pageSize
          }
        })
        .then(res => {
          let {
            data: { data, status }
          } = res;
          if (status === 1) {
            if (eventType === "click") {
              this.data4Pages = data.pages; //总页数
              this.sycurPage = data.current;
              // console.log(this.data1Pages,data.pages,this.slcurPage)
              this.data4 = data.records.map(
                ({ szmc, blc, ly, hqfs, gxsj, dj, sjl, fgfw, fgl }, idx) => {
                  return {
                    number: 1,
                    cityName: szmc,
                    scale: blc,
                    dataSourece: ly,
                    access: hqfs,
                    lastUpdateTime: gxsj,
                    mapLevel: dj,
                    // layerNumber: 4852323,
                    // primCounts: 18,
                    dataVolume: sjl + "G",
                    coverage: fgfw,
                    coverageMode: fgl,
                    cellClassName: {
                      age: "demo-table-info-cell-age",
                      address: "demo-table-info-cell-address"
                    }
                  };
                }
              );
            }
            if (eventType === "scroll") {
              this.data4Pages = data.pages; //总页数
              this.sycurPage = data.current;
              if (data.records.length > 0) {
                //为真时删除加载框,加载状态设置为true
                setTimeout(() => {
                  el.parentElement.removeChild(el);
                  data.records.map(
                    (
                      { szmc, blc, ly, hqfs, gxsj, dj, sjl, fgfw, fgl },
                      idx
                    ) => {
                      this.data4.push({
                        number: 1,
                        cityName: szmc,
                        scale: blc,
                        dataSourece: ly,
                        access: hqfs,
                        lastUpdateTime: gxsj,
                        mapLevel: dj,
                        // layerNumber: 4852323,
                        // primCounts: 18,
                        dataVolume: sjl + "G",
                        coverage: fgfw,
                        coverageMode: fgl,
                        cellClassName: {
                          age: "demo-table-info-cell-age",
                          address: "demo-table-info-cell-address"
                        }
                      });
                    }
                  );
                }, 1000);
                setTimeout(() => {
                  this.syLoadingStatus = true;
                }, 2000);
              } else if (data.records.length == 0) {
                // this.slLoadingStatus = false;
                el.innerText = "数据加载完毕";
              }
            }
          }
        });
    },

    getMapSmallData({
      city = null,
      page = 1,
      pageSize = 10,
      eventType = "click",
      type = null
    }) {
      this.sz = city;
      var url = this.$config.baseUrl.dev;
      //地图城市
      //矢量
      this.$axios
        .get(url + "/plat/map/sl", {
          params: {
            city,
            page,
            pageSize
          }
        })
        .then(res => {
          let {
            data: { data, status }
          } = res;
          if (status === 1) {
            if (eventType === "click") {
              this.data1Pages = data.pages;
              this.dlmoreload(
                0,
                "sl",
                this.data1Pages,
                this.slcurPage,
                this.slLoadingStatus
              );
              this.data1 = data.records.map(
                ({ szmc, blc, ly, hqfs, gxsj, dj, sjl, fgfw, fgl }, idx) => {
                  return {
                    number: 1,
                    cityName: szmc,
                    scale: blc,
                    dataSourece: ly,
                    access: hqfs,
                    lastUpdateTime: gxsj,
                    mapLevel: dj,
                    // layerNumber: 4852323,
                    // primCounts: 18,
                    dataVolume: sjl + "G",
                    coverage: fgfw,
                    coverageMode: fgl,
                    cellClassName: {
                      age: "demo-table-info-cell-age",
                      address: "demo-table-info-cell-address"
                    }
                  };
                }
              );
            }
            if (eventType === "scroll" && type === "sl") {
              if (data.records.length > 0) {
                this.slLoadingStatus = true;
                // console.log(666);
                // this.data1 = data.records.map(
                //   ({ szmc, blc, ly, hqfs, gxsj, dj, sjl, fgfw, fgl }, idx) => {
                //     this.data1.push({
                //       number: 1,
                //       cityName: szmc,
                //       scale: blc,
                //       dataSourece: ly,
                //       access: hqfs,
                //       lastUpdateTime: gxsj,
                //       mapLevel: dj,
                //       // layerNumber: 4852323,
                //       // primCounts: 18,
                //       dataVolume: sjl + "G",
                //       coverage: fgfw,
                //       coverageMode: fgl,
                //       cellClassName: {
                //         age: "demo-table-info-cell-age",
                //         address: "demo-table-info-cell-address"
                //       }
                //     });
                //   }
                // );
                data.records.map(
                  ({ szmc, blc, ly, hqfs, gxsj, dj, sjl, fgfw, fgl }, idx) => {
                    this.data1.push({
                      number: 1,
                      cityName: 1,
                      scale: 1,
                      dataSourece: 1,
                      access: 1,
                      lastUpdateTime: 1,
                      mapLevel: 1,
                      // layerNumber: 4852323,
                      // primCounts: 18,
                      dataVolume: 1,
                      coverage: 1,
                      coverageMode: 1,
                      cellClassName: {
                        age: "demo-table-info-cell-age",
                        address: "demo-table-info-cell-address"
                      }
                    });
                  }
                );
              } else {
                var ele = document.getElementsByClassName("ivu-table-body")[0];
                var childEle = document.createElement("TR");
                childEle.innerHTML = `数据已全部加载`;
                childEle.style.color = "#fff";
                childEle.style.textAlign = "center";
                childEle.style.width = "1016px";
                childEle.style.lineHeight = "30px";
                childEle.style.height = "30px";
                childEle.style.display = "inline-block";
                ele.append(childEle);
              }
            }
          }
        });
      //影像
      this.$axios
        .get(url + "/plat/map/yx", {
          params: {
            city,
            page,
            pageSize
          }
        })
        .then(res => {
          let {
            data: { data, status }
          } = res;
          if (status === 1) {
            if (eventType === "click") {
              this.data2Pages = data.pages;
              setTimeout(() => {
                // console.log(this.data2Pages, this.yxcurPage)
                this.dlmoreload(
                  1,
                  "yx",
                  this.data2Pages,
                  this.yxcurPage,
                  this.yxLoadingStatus
                );
              }, 2000);

              this.data2 = data.records.map(
                ({ szmc, blc, ly, hqfs, gxsj, dj, sjl, fgfw, fgl }, idx) => {
                  return {
                    number: 1,
                    cityName: szmc,
                    scale: blc,
                    dataSourece: ly,
                    access: hqfs,
                    lastUpdateTime: gxsj,
                    mapLevel: dj,
                    // layerNumber: 4852323,
                    // primCounts: 18,
                    dataVolume: sjl + "G",
                    coverage: fgfw,
                    coverageMode: fgl,
                    cellClassName: {
                      age: "demo-table-info-cell-age",
                      address: "demo-table-info-cell-address"
                    }
                  };
                }
              );
            }
            if (eventType === "scroll" && type === "yx") {
              if (data.records.length > 0) {
                data.records.map(
                  ({ szmc, blc, ly, hqfs, gxsj, dj, sjl, fgfw, fgl }, idx) => {
                    this.data2.push({
                      number: 1,
                      cityName: 1,
                      scale: 1,
                      dataSourece: 1,
                      access: 1,
                      lastUpdateTime: 1,
                      mapLevel: 1,
                      // layerNumber: 4852323,
                      // primCounts: 18,
                      dataVolume: 1 + "G",
                      coverage: 1,
                      coverageMode: 1,
                      cellClassName: {
                        age: "demo-table-info-cell-age",
                        address: "demo-table-info-cell-address"
                      }
                    });
                  }
                );
                this.yxLoadingStatus = true;
              } else {
                var ele = document.getElementsByClassName("ivu-table-body")[1];
                var childEle = document.createElement("TR");
                childEle.innerHTML = `数据已全部加载`;
                childEle.style.color = "#fff";
                childEle.style.textAlign = "center";
                childEle.style.width = "1016px";
                childEle.style.lineHeight = "30px";
                childEle.style.height = "30px";
                childEle.style.display = "inline-block";
                ele.append(childEle);
              }
            }
          }
        });
      //矢影
      this.$axios
        .get(url + "/plat/map/sy", {
          params: {
            city,
            page,
            pageSize
          }
        })
        .then(res => {
          let {
            data: { data, status }
          } = res;
          if (status === 1) {
            if (eventType === "click") {
              setTimeout(() => {
                this.data4Pages = data.pages;
                console.log(this.data4Pages, this.sycurPage);
                this.dlmoreload(
                  2,
                  "sy",
                  this.data4Pages,
                  this.sycurPage,
                  this.syLoadingStatus
                );
              }, 2000);

              this.data4 = data.records.map(
                ({ szmc, blc, ly, hqfs, gxsj, dj, sjl, fgfw, fgl }, idx) => {
                  return {
                    number: 1,
                    cityName: szmc,
                    scale: blc,
                    dataSourece: ly,
                    access: hqfs,
                    lastUpdateTime: gxsj,
                    mapLevel: dj,
                    // layerNumber: 4852323,
                    // primCounts: 18,
                    dataVolume: sjl + "G",
                    coverage: fgfw,
                    coverageMode: fgl,
                    cellClassName: {
                      age: "demo-table-info-cell-age",
                      address: "demo-table-info-cell-address"
                    }
                  };
                }
              );
            }
            if (eventType === "scroll" && type === "sy") {
              if (data.records.length > 0) {
                console.log(666);
                this.syLoadingStatus = true;

                data.records.map(
                  ({ szmc, blc, ly, hqfs, gxsj, dj, sjl, fgfw, fgl }, idx) => {
                    this.data4.push({
                      number: 1,
                      cityName: 1,
                      scale: 1,
                      dataSourece: 1,
                      access: 1,
                      lastUpdateTime: 1,
                      mapLevel: 1,
                      // layerNumber: 4852323,
                      // primCounts: 18,
                      dataVolume: 1 + "G",
                      coverage: 1,
                      coverageMode: 1,
                      cellClassName: {
                        age: "demo-table-info-cell-age",
                        address: "demo-table-info-cell-address"
                      }
                    });
                  }
                );
              } else {
                var ele = document.getElementsByClassName("ivu-table-body")[2];
                var childEle = document.createElement("TR");
                childEle.innerHTML = `数据已全部加载`;
                childEle.style.color = "#fff";
                childEle.style.textAlign = "center";
                childEle.style.width = "1016px";
                childEle.style.lineHeight = "30px";
                childEle.style.height = "30px";
                childEle.style.display = "inline-block";
                ele.append(childEle);
              }
            }
          }
        });
    },
    sousuo() {
      this.curPage = 1;
      if (this.curOperate === 0) {
        this.getSmallData({
          dataType: this.curdataType,
          name: this.inputVal,
          pageSize: config.pageSize
        });
      }
      if (this.curOperate === 1) {
        this.getSmallData({
          dataType: this.curdataType,
          name: this.inputVal,
          pageSize: config.ps
        });
      }
      this.showGridScroll();
    },
    //滚动加载
    moreLoad() {
      // var
      return new Promise(resolve => {
        this.curPage = this.curPage + 1;
        console.log(this.curPage, this.pages);
        if (this.curPage < this.pages) {
          setTimeout(() => {
            this.getSmallData({
              dataType: this.curdataType,
              page: this.curPage,
              pageSize: config.ps,
              eventType: "scroll"
            });
            resolve();
          }, 2000);
          this.loadingText = "数据加载中";
        } else {
          this.loadingText = "数据已加载完";
          console.log(this.loadingText);
        }
      });
    },
    changePage(value) {
      this.getSmallData({
        dataType: this.curdataType,
        name: this.inputVal,
        page: value
      });
    },
    jj(e) {
      e = e || window.event;
      if (e.stopPropagation) {
        e.stopPropagation();
      } else {
        e.cancelBubble = true;
      }
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
    },
    //生成加载行
    createElement() {
      var childEle = document.createElement("TR");
      childEle.innerHTML = `<div><div class="ivu-spin ivu-spin-default"><div class="ivu-spin-main"><span class="ivu-spin-dot"></span> <div class="ivu-spin-text"></div></div></div>加载中...`;
      childEle.style.color = "#fff";
      childEle.style.textAlign = "center";
      childEle.style.width = "1016px";
      childEle.style.lineHeight = "30px";
      childEle.style.height = "30px";
      childEle.style.display = "inline-block";
      childEle.classList.add("loading");
      return childEle;
    },
    removeElement() {
      //初始化加载状态
      this.slLoadingStatus = true; //滚动加载节流状态
      this.slcurPage = 1;
      this.data1Pages = "";
      this.yxLoadingStatus = true; //滚动加载节流状态
      this.yxcurPage = 1;
      this.data2Pages = "";
      this.syLoadingStatus = true; //滚动加载节流状态
      this.sycurPage = 1;
      this.data4Pages = "";
      //初始化滚动条高度
      var ele = document.getElementsByClassName("ivu-table-body");
      if (ele.length > 0) {
        [].map.call(ele, item => {
          item.scrollTop = 0;
        });
      }

      //清除加载行
      var loadEle = document.getElementsByClassName("loading");
      console.log(loadEle)
      if (loadEle.length > 0) {
        [].map.call(loadEle, item => {
          item.parentElement.removeChild(item);
        });
      }
    }
    // handel(event, idx, type, pages, curPage, loadingStatus, ele) {
    //   event.cancelBubble = true;
    //   var scrollTop = event.target.scrollTop;
    //   var clientHeight = event.target.clientHeight;
    //   var scrollHeight = event.target.scrollHeight;
    //   if (
    //     scrollHeight == scrollTop + clientHeight &&
    //     loadingStatus == true &&
    //     (curPage < pages || curPage == pages)
    //   ) {
    //     loadingStatus = false;
    //     curPage = curPage + 1;
    //     var childEle = document.createElement("TR");
    //     childEle.innerHTML = `<div><div class="ivu-spin ivu-spin-default"><div class="ivu-spin-main"><span class="ivu-spin-dot"></span> <div class="ivu-spin-text"></div></div></div>加载中...`;
    //     childEle.style.color = "#fff";
    //     childEle.style.textAlign = "center";
    //     childEle.style.width = "1016px";
    //     childEle.style.lineHeight = "30px";
    //     childEle.style.height = "30px";
    //     childEle.style.display = "inline-block";
    //     ele.append(childEle);
    //     // ele.innerHTML = (`<tr><Spin fix>加载中</Spin></tr>`)
    //     setTimeout(() => {
    //       this.getMapSmallData({
    //         city: this.sz,
    //         eventType: "scroll",
    //         type,
    //         page: curPage
    //       });
    //       // var el =
    //       ele.removeChild(childEle);
    //     }, 2000);
    //   }
    // },
    //   dlmoreload(idx, type, pages, curPage, loadingStatus) {
    //     // ele.removeEventListener("scroll", function rr(event){self.handel(event,idx, type, pages, curPage,loadingStatus,ele)});

    //     //第一次请求20条数据,当请求数据大于10条时,出现滚动条,滚动到底部在请求一次,有数据则推到表格后面,没数据时出现提示框或其他,看看是否能价格加载过度动画
    //     var ele = document.getElementsByClassName("ivu-table-body")[idx];
    //     var self = this;
    //     ele.addEventListener("scroll", function rr(event) {
    //       self.handel(event, idx, type, pages, curPage, loadingStatus, ele);
    //     });
    //     ele.addEventListener("mousewheel", event => {
    //       event = event || window.event;
    //       document.getElementsByClassName("ivu-table-body")[idx].scrollTop +=
    //         event.wheelDelta > 0 ? -60 : 60;
    //       return false;
    //     });
    //     var firefox = navigator.userAgent.indexOf("Firefox") != -1;
    //     firefox
    //       ? ele.addEventListener("DOMMouseScroll", this.jj, false)
    //       : (ele.onmousewheel = this.jj);
    //   }
  },
  created() {},
  computed: {
    //用computed监听data的变化,返回不同的值,做到props传递不同值使表格高度自适应变化
    data5Height() {
      if (this.data1.length > 1) {
        return 180;
        // return 520;
      } else {
        return 0;
      }
    }
  },
  mounted() {
    this.getBigData();
    this.getSmallData({ dataType: 1, pageSize: 10 });
    // this.getMapData({ type: "map", dataType: 1 });
    // this.getMapData({ type: "map", dataType: 2 });
    // this.getMapData({ type: "map", dataType: 3 });
    //地理表格内的滚动条监听事件
    var self = this;
    //矢量
    var ele = document.getElementsByClassName("ivu-table-body")[0];
    ele.addEventListener("scroll", async function rr(event) {
      var scrollTop = event.target.scrollTop;
      var clientHeight = event.target.clientHeight;
      var scrollHeight = event.target.scrollHeight;
      if (
        scrollHeight == scrollTop + clientHeight &&
        self.slLoadingStatus === true
      ) {
        var tr = self.createElement();
        self.slLoadingStatus = false;
        ele.append(tr);
        console.log(self.slcurPage, self.data1Pages);
        if (self.slcurPage < self.data1Pages) {
          self.getslData({
            city: self.sz,
            page: self.slcurPage + 1,
            eventType: "scroll",
            el: tr
          });
        } else {
          setTimeout(() => {
            var tr = ele.getElementsByClassName("loading")[0];
            console.log(tr);
            tr.innerText = "数据加载完成";
          }, 2000);
        }
      }
    });
    ele.addEventListener("mousewheel", event => {
      event = event || window.event;
      document.getElementsByClassName("ivu-table-body")[0].scrollTop +=
        event.wheelDelta > 0 ? -60 : 60;
      return false;
    });
    var firefox = navigator.userAgent.indexOf("Firefox") != -1;
    firefox
      ? ele.addEventListener("DOMMouseScroll", this.jj, false)
      : (ele.onmousewheel = this.jj);

    //影像
    var ele2 = document.getElementsByClassName("ivu-table-body")[1];
    ele2.addEventListener("scroll", async function rr(event) {
      var scrollTop = event.target.scrollTop;
      var clientHeight = event.target.clientHeight;
      var scrollHeight = event.target.scrollHeight;
      if (
        scrollHeight == scrollTop + clientHeight &&
        self.yxLoadingStatus === true
      ) {
        var tr = self.createElement();
        self.yxLoadingStatus = false;
        ele2.append(tr); 
        if (self.yxcurPage < self.data2Pages) {
          self.getyxData({
            city: self.sz,
            page: self.slcurPage + 1,
            eventType: "scroll",
            el: tr
          });
        } else {
          setTimeout(() => {
            var tr = ele2.getElementsByClassName("loading")[0];
            tr.innerText = "数据加载完成";
          }, 2000);
        }
      }
    });
    ele2.addEventListener("mousewheel", event => {
      event = event || window.event;
      document.getElementsByClassName("ivu-table-body")[1].scrollTop +=
        event.wheelDelta > 0 ? -60 : 60;
      return false;
    });
    var firefox = navigator.userAgent.indexOf("Firefox") != -1;
    firefox
      ? ele2.addEventListener("DOMMouseScroll", this.jj, false)
      : (ele2.onmousewheel = this.jj);

    //矢影
    var ele4 = document.getElementsByClassName("ivu-table-body")[2];

    ele4.addEventListener("scroll", async function rr(event) {
      var scrollTop = event.target.scrollTop;
      var clientHeight = event.target.clientHeight;
      var scrollHeight = event.target.scrollHeight;
      if (
        scrollHeight == scrollTop + clientHeight &&
        self.syLoadingStatus === true
      ) {
        var tr = self.createElement();
        self.syLoadingStatus = false;
        ele4.append(tr);
        if (self.sycurPage < self.data4Pages) {
          self.getsyData({
            city: self.sz,
            page: self.sycurPage + 1,
            eventType: "scroll",
            el: tr
          });
        } else {
          setTimeout(() => {
            var tr = ele4.getElementsByClassName("loading")[0];
            console.log(tr);
            tr.innerText = "数据加载完成";
          }, 2000);
        }
      }
    });
    ele4.addEventListener("mousewheel", event => {
      event = event || window.event;
      document.getElementsByClassName("ivu-table-body")[2].scrollTop +=
        event.wheelDelta > 0 ? -60 : 60;
      return false;
    });
    var firefox = navigator.userAgent.indexOf("Firefox") != -1;
    firefox
      ? ele4.addEventListener("DOMMouseScroll", this.jj, false)
      : (ele4.onmousewheel = this.jj);
  }
};
</script>
<style scoped lang="less">
#dataBox {
  position: relative;
  .nav {
    position: relative;
    width: 1073px;
    min-height: 80px;
    background: url("../../assets/images/hnimages/layerNav.png") no-repeat;
    background-size: 98% 100%;
    ul {
      font-size: 14px;
      color: #c0e5ff;
      padding: 28px 0 0 20px;
      li {
        float: left;
        margin-right: 16px;
        padding: 0 10px;
        cursor: pointer;
        &.active {
          background-image: linear-gradient(0deg, #1771af 0%, #3daefc 100%);
          box-shadow: 0px 0px 5px 0px rgba(163, 246, 248, 0.85);
        }
      }
    }
    .st {
      padding: 10px 0 30px 20px;
    }

    .operateBox,
    .searchBox {
      position: absolute;
      right: 38px;
      top: 20px;
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
      right: 46px;
      top: 60px;
      width: 170px;
      height: 26px;
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
      right: 196px;
      top: 64px;
      font-size: 14px;
      color: #c0e5ff;
      opacity: 0.8;
    }
  }
  h2 {
    font-size: 18px;
    color: rgba(255, 255, 255, 1);
    line-height: 72px;
    border-bottom: 1px solid #3daefc;
    margin: 0 2px 0 10px;
  }
  h3 {
    margin-left: 21px;
    font-size: 16px;
    color: rgba(255, 255, 255, 1);
    line-height: 72px;
  }
  .dataTableBox {
    position: relative;
    width: 1073px;
    height: 524px;
    overflow: hidden;
    margin-top: 20px;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .tableBox {
    margin-left: 8px;
  }
  .dataTable {
    // overflow: auto;
    // &::-webkit-scrollbar {
    //   display: none;
    // }
    // height: 500px;
  }
  .content2 {
    position: absolute;
  }
  #drag,
  #drag2 {
    position: absolute;
    display: inline-block;
    width: 4px;
    height: 524px;
    box-sizing: content-box;
    top: 126px;
    right: 12px;
  }
  .bar,
  .bar2 {
    position: absolute;
    width: 4px;
    height: 20px;
    background: rgba(116, 241, 255, 0.85);
    border-radius: 5px;
  }
  .floHead {
    position: absolute;
    top: 110px;
    right: 0px;
    width: 1063px;
    z-index: 999;
    border: 1px solid #3daefc;
    background-color: #026eb9;
    box-shadow: 0px 0px 8px 0px rgba(116, 241, 255, 0.85);
  }
  .comprise {
    width: 208px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 12px;
    color: #ffffff;
    font-weight: bold;
  }
}
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

