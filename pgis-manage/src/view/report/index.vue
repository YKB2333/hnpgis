<template>
  <div>
    <Header />
    <div id="main">
      <div class="container">
        <Menu />
        <div id="dataBox">
          <div class="nav">
            <div class="app" @click="dropDown" @mouseleave="clear" ref="navi1">
              <span>{{curPolice.length>2?curPolice.slice(0,2)+"...":curPolice}}</span>
              <i class="arrow"></i>
              <ul>
                <li @click="choosePolice('全部')">全部</li>
                <li
                  v-for="(item,idx) in policeRecords"
                  :key="idx"
                  @click="choosePolice(item.lxmc)"
                >{{item.lxmc.length>6?item.lxmc.slice(0,6)+"...":item.lxmc}}</li>
              </ul>
            </div>
            <div class="service" @click="dropDown2" @mouseleave="clear2" ref="navi2">
              <span>{{curApp.length>2?curApp.slice(0,2)+"...":curApp}}</span>
              <i class="arrow"></i>
              <ul>
                <li @click="chooseAppService('全部')">全部</li>
                <li
                  v-for="(item,idx) in serviceRecords"
                  :key="idx"
                  :title="item.serviceName"
                  @click="chooseAppService(item.serviceName)"
                >{{item.serviceName.length>6?item.serviceName.slice(0,6)+"...":item.serviceName}}</li>
              </ul>
            </div>
            <div class="timeRange">
              <i-col span="12">
                <Date-picker
                  @on-change="dayin"
                  type="daterange"
                  confirm
                  placeholder="选择日期"
                  style="width:200px"
                ></Date-picker>
              </i-col>
            </div>
            <div
              class="serach"
              @mousedown="dropDown3"
              @mouseup="clear3"
              @click="checkout"
              ref="searchBtn"
            >
              <span>查询</span>
            </div>
            <div class="operateBox">
              <i class="iconfont icon-xiazai" title="下载" @click="download"></i>
            </div>
          </div>
          <Layer
            :columns="columns"
            :data="data"
            :curPage="curPage"
            :responseTotal="responseTotal"
            :changePage="changePage"
          />

          <!-- :curOperate="curOperate" -->
          <!-- :scrollStatus="scrollStatus" -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Header from "../../components/rs_header/rs_header";
import Menu from "../../components/rs_menu/rs_menu";
import "./report.less";
import Layer from "./layer";
export default {
  components: {
    Header,
    Menu,
    Layer
  },
  data() {
    return {
      serviceRecords: [],
      policeRecords: [],
      curPolice: "警种",
      curApp: "服务",
      curappName: null,
      curlxmc: null,
      curPage: 1,
      responseTotal: "",
      columns: [
        {
          title: "警种名称",
          key: "appName",
          align: "center"
        },
        {
          title: "服务名称",
          key: "serviceName",
          align: "center"
        },
        {
          title: "访问IP",
          key: "clientIp",
          align: "center"
        },
        {
          title: "请求时间",
          key: "requestTime",
          align: "center"
        },

        {
          title: "服务链接",
          key: "serviceUrl",
          align: "center",
          className: "serviceUrl"
        },
        {
          title: "状态",
          key: "serviceStatus",
          align: "center"
        }
      ],
      data: [],
      searchDate: [""]
    };
  },
  computed: {},
  methods: {
    jump(idx) {
      this.curSource = idx;
    },
    changePage(value) {
      this.curPage = value;
      this.jumpPage(this.curPage);
      // this.getData(this.curlxmc, this.curappName, value);
      // if (this.searchDate.length > 0) {
      //   this.getData(
      //     null,
      //     null,
      //     this.searchDate[0] + " 00:00:00",
      //     this.searchDate[1] + " 00:00:00",
      //     value
      //   );
      // } else if (this.curlxmc != null) {
      //   this.getData(this.curlxmc, null, null, null, value);
      // } else if (this.curappName != null) {
      //   this.getData(null, this.curappName, null, null, value);
      // } else {
      //   this.getData(null, null, null, null, value);
      // }
    },
    //点击下拉事件
    dropDown(e) {
      var parentDOM = this.$refs.navi1;
      parentDOM.style.backgroundColor = "#3DAEFC";
      parentDOM.children[2].style.display = "block";
    },
    dropDown2(e) {
      var parentDOM = this.$refs.navi2;
      parentDOM.style.backgroundColor = "#3DAEFC";
      parentDOM.children[2].style.display = "block";
    },
    dropDown3(e) {
      var parentDOM = this.$refs.searchBtn;
      parentDOM.children[0].style.backgroundImage =
        "linear-gradient(0deg, #3DAEFC  0%, #3DAEFC  100%)";
    },
    //清除样式
    clear() {
      var parentDOM = this.$refs.navi1;
      parentDOM.style.backgroundColor = "transparent";
      parentDOM.children[2].style.display = "none";
    },
    clear2() {
      var parentDOM = this.$refs.navi2;
      parentDOM.style.backgroundColor = "transparent";
      parentDOM.children[2].style.display = "none";
    },
    clear3() {
      var parentDOM = this.$refs.searchBtn;
      parentDOM.children[0].style.backgroundImage =
        "linear-gradient(0deg, #1771af 0%, #3daefc 100%)";
    },
    //调用接口
    //服务类别
    getAppServiceData() {
      var url = this.$config.baseUrl.dev;
      this.$axios.get(url + "/application/list").then(res => {
        let {
          data: { data, status }
        } = res;
        if (status === 1) {
          this.serviceRecords = data;
          // this.data = data.records.map((item, idx) => {
          //   return {
          //     number: idx,
          //     name: item.name,
          //     address: item.address,
          //     ip: item.ip,
          //     requestTime: item.requestTime,
          //     responeTime: item.responeTime,
          //     time : item.time,
          //     cellClassName: {
          //       age: "demo-table-info-cell-age",
          //       address: "demo-table-info-cell-address"
          //     }
          //   };
          // });
        }
      });
    },
    //警种类别
    getPoliceData() {
      var url = this.$config.baseUrl.dev;
      this.$axios.get(url + "/plat/baseData/police").then(res => {
        let {
          data: { data, status }
        } = res;
        if (status === 1) {
          this.policeRecords = data;
        }
      });
    },
    //表格数据
    getData(
      policeType = null,
      serviceName = null,
      startTime = null,
      endTime = null,
      page = 1,
      pageSize = 10
    ) {
      var url = this.$config.baseUrl.dev;
      this.$axios
        .get(url + "/log/list", {
          params: {
            page,
            pageSize,
            policeType,
            serviceName,
            startTime,
            endTime
          }
        })
        .then(res => {
          let {
            data: { data, status }
          } = res;
          if (status === 1) {
            this.responseTotal = data.total;
            this.data = data.records.map((item, idx) => {
              if (item.serviceStatus === "normal") {
                var serviceStatus = "正常";
              } else if (item.serviceStatus === "exception") {
                var serviceStatus = "故障";
              }
              return {
                number: idx,
                appName: item.appName,
                serviceName: item.serviceName,
                // address: item.address,
                clientIp: item.clientIp,
                requestTime: item.requestTime,
                responseTime: item.responseTime,
                serviceUrl: item.serviceUrl,
                serviceStatus,
                cellClassName: {
                  age: "demo-table-info-cell-age",
                  address: "demo-table-info-cell-address"
                }
              };
            });
            this.$forceUpdate();
          }
        });
    },
    downloadData(url, str) {
      var xhr = new XMLHttpRequest();
      var fileName = `统计报表-${this.curPolice}-${this.curApp}`;
      xhr.open("POST", url, true); // 也可以使用POST方式，根据接口
      xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
      xhr.responseType = "blob"; // 返回类型blob
      // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
      xhr.onload = function() {
        // 请求完成
        if (this.status === 200) {
          // 返回200
          var blob = this.response;
          var reader = new FileReader();
          reader.readAsDataURL(blob); // 转换为base64，可以直接放入a的href
          reader.onload = function(e) {
            // 转换完成，创建一个a标签用于下载
            var a = document.createElement("a");
            a.download = `${fileName}.xlsx`;
            a.href = e.target.result;
            a.click();
          };
        }
      };
      // 发送ajax请求
      xhr.send(str);

      // this.$axios
      //   .post(
      //     url + `/log/export`,
      //     {
      //       policeType,
      //       serviceName,
      //       startTime,
      //       endTime
      //     },
      //     { responseType: "blob" }
      //   )
      //   .then(function(response) {
      //       var blob = new Blob([response.data]);
      //       var downloadElement = document.createElement("a");
      //       var href = window.URL.createObjectURL(blob); //创建下载的链接
      //       downloadElement.href = href;
      //       downloadElement.download = "数据.xlsx"; //下载后文件名
      //       // document.body.appendChild(downloadElement);
      //       downloadElement.click(); //点击下载
      //       // document.body.removeChild(downloadElement); //下载完成移除元素
      //       window.URL.revokeObjectURL(href); //释放掉blob对象
      //   });
    },
    chooseAppService(serviceName) {
      this.curApp = serviceName;
    },
    choosePolice(lxmc) {
      console.log(lxmc);
      this.curPolice = lxmc;
    },
    //日期变化函数
    dayin(value) {
      this.searchDate = value;
    },
    checkout(page) {
      this.curPage = 1;
      this.jumpPage(this.curPage);
    },
    jumpPage(page) {
      if (this.curPolice === "全部" || this.curPolice === "警种") {
        if (this.curApp === "全部" || this.curApp === "服务") {
          if (this.searchDate[0].length > 0) {
            console.log(this.searchDate);
            this.getData(
              null,
              null,
              this.searchDate[0] + " 00:00:00",
              this.searchDate[1] + " 00:00:00",
              page
            );
          } else {
            this.getData(null, null, null, null, page);
          }
        } else {
          if (this.searchDate[0].length > 0) {
            this.getData(
              null,
              this.curApp,
              this.searchDate[0] + " 00:00:00",
              this.searchDate[1] + " 00:00:00",
              page
            );
          } else {
            this.getData(null, this.curApp, null, null, page);
          }
        }
      } else {
        if (this.curApp === "全部" || this.curApp === "服务") {
          if (this.searchDate[0].length > 0) {
            this.getData(
              this.curPolice,
              null,
              this.searchDate[0] + " 00:00:00",
              this.searchDate[1] + " 00:00:00",
              page
            );
          } else {
            this.getData(this.curPolice, null, null, null, page);
          }
        } else {
          if (this.searchDate[0].length > 0) {
            this.getData(
              this.curPolice,
              this.curApp,
              this.searchDate[0] + " 00:00:00",
              this.searchDate[1] + " 00:00:00",
              page
            );
          } else {
            this.getData(this.curPolice, this.curApp, null, null, page);
          }
        }
      }
    },
    download() {
      var url = this.$config.baseUrl.dev;
      url = url + `/log/export`;
      if (this.curPolice === "全部" || this.curPolice === "警种") {
        if (this.curApp === "全部" || this.curApp === "服务") {
          if (this.searchDate[0].length > 0) {
            var str = JSON.stringify({
              startTime: this.searchDate[0] + " 00:00:00",
              endTime: this.searchDate[1] + " 00:00:00"
            });
          } else {
            var str = JSON.stringify({});
          }
        } else {
          if (this.searchDate[0].length > 0) {
            var str = JSON.stringify({
              serviceName: this.curApp,
              startTime: this.searchDate[0] + " 00:00:00",
              endTime: this.searchDate[1] + " 00:00:00"
            });
          } else {
            var str = JSON.stringify({
              serviceName: this.curApp
            });
            // this.downloadData(null, this.curApp, null, null);
          }
        }
      } else {
        if (this.curApp === "全部" || this.curApp === "服务") {
          if (this.searchDate[0].length > 0) {
            var str = JSON.stringify({
              policeType: this.curPolice,
              startTime: this.searchDate[0] + " 00:00:00",
              endTime: this.searchDate[1] + " 00:00:00"
            });
          } else {
            var str = JSON.stringify({
              policeType: this.curPolice
            });
            // this.downloadData(this.curPolice, null, null, null);
          }
        } else {
          if (this.searchDate[0].length > 0) {
            var str = JSON.stringify({
              policeType: this.curPolice,
              serviceName: this.curApp,
              startTime: this.searchDate[0] + " 00:00:00",
              endTime: this.searchDate[1] + " 00:00:00"
            });
          } else {
            var str = JSON.stringify({
              policeType: this.curPolice,
              serviceName: this.curApp
            });

            // this.downloadData(this.curPolice, this.curApp, null, null);
          }
        }
      }
      this.downloadData(url, str);
    }
  },
  mounted() {
    this.getAppServiceData();
    this.getPoliceData();
    this.getData();
  },
// beforeRouteEnter(to, from, next) {
//     function getCookie(key) {
//       var str = document.cookie;
//       var arr = str.split("; ");
//       for (var i = 0; i < arr.length; i++) {
//         var arr2 = arr[i].split("=");
//         if (key == arr2[0]) {
//           return arr2[1];
//         }
//       }
//     }
//     // console.log(getCookie("user"));
//     if (getCookie("user")) {
//       next();
//     } else {
//       // console.log("loading");
//       window.location.href = "http://www.pgis.hn/pgismap/login.html";
//     }
//   },
};
</script>
<style scoped lang="less">
#main .container #dataBox {
  overflow: visible;
  .nav {
    position: relative;
    width: 1156px;
    height: 92px;
    background: url("../../assets/images/hnimages/layerNav.png") no-repeat;
    background-size: 98% 106%;
    .app,
    .service {
      z-index: 999;
      &:hover {
        span {
          color: #fff;
        }
        i {
          border-color: #fff transparent transparent transparent;
        }
      }
      cursor: pointer;
    }
    .app,
    .service,
    .timeRange,
    .serach {
      width: 80px;
      height: 34px;
      border: 1px solid #3daefc;
      position: absolute;
      padding-left: 12px;
      margin: 36px 0 0 40px;
      span {
        font-size: 16px;
        color: rgba(192, 229, 255, 1);
        line-height: 34px;
      }
      .arrow {
        position: absolute;
        border: 5px solid #c0e5ff;
        border-color: #c0e5ff transparent transparent transparent;
        right: 12px;
        top: 15px;
      }
      ul {
        display: none;
        top: 33px;
        left: -1px;
        width: 100%;
        position: absolute;
        li {
          float: left;
          width: 106px;
          background-color: #046db7;
          font-size: 12px;
          line-height: 26px;
          padding-left: 12px;
          color: #c0e5ff;
          &:hover {
            background-color: #3daefc;
          }
        }
      }
      &:hover {
        span {
          color: #fff;
        }
      }
    }
    .service {
      margin: 36px 0 0 160px;
    }
    .timeRange {
      margin-left: 280px;
      width: 256px;
      border: none;
    }
    .serach {
      margin-left: 550px;
      border: none;
      text-align: center;
      span {
        display: inline-block;
        width: 59px;
        line-height: 32px;
        font-size: 16px;
        color: #c0e5ff;
        cursor: pointer;
        background-image: linear-gradient(0deg, #1771af 0%, #3daefc 100%);
        box-shadow: 0px 0px 5px 0px rgba(163, 246, 248, 0.85);
      }
    }
    .operateBox {
      position: absolute;
      right: 38px;
      top: 30px;
      i {
        margin-right: 18px;
        font-size: 22px;
        color: #c0e5ff;
        &:active {
          color: #3daefc;
        }
      }
    }
  }
}
</style>

