<template>
  <div>
    <Header />
    <div id="main">
      <div class="container">
        <Menu />
        <div id="dataBox">
          <div class="nav">
            <div class="app" @click="dropDown" @mouseleave="clear" ref="navi1">
              <span>警种</span>
              <i class="arrow"></i>
              <ul>
                <li @click="choosePolice()">全部</li>
                <li
                  v-for="(item,idx) in policeRecords"
                  :key="idx"
                  @click="choosePolice(item.lxmc)"
                >{{item.lxmc.length>6?item.lxmc.slice(0,6)+"...":item.lxmc}}</li>
              </ul>
            </div>
            <div class="service" @click="dropDown2" @mouseleave="clear2" ref="navi2">
              <span>服务</span>
              <i class="arrow"></i>
              <ul>
                <li @click="choosePolice()">全部</li>
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
              <i class="iconfont iconxiazai"></i>
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
      searchDate: []
    };
  },
  computed: {},
  methods: {
    jump(idx) {
      this.curSource = idx;
    },
    changePage(value) {
      this.getData(this.curlxmc, this.curappName, value);
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
      this.curPage = 1;
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
          }
        });
    },
    chooseAppService(serviceName) {
      this.curappName = serviceName;
      // console.log(this.curappName);
      this.getData(null, this.curappName);
    },
    choosePolice(lxmc) {
      this.curlxmc = lxmc;
      this.getData(this.curlxmc);
    },
    //日期变化函数
    dayin(value) {
      this.searchDate = value;
    },
    checkout() {
      console.log(this.searchDate)
      this.getData(null, null,this.searchDate[0]+" 00:00:00",this.searchDate[1]+" 00:00:00");
    }
  },
  mounted() {
    this.getAppServiceData();
    this.getPoliceData();
    this.getData();
  }
};
</script>
<style scoped lang="less">
#main .container #dataBox {
  overflow: visible;
  .nav {
    position: relative;
    width: 1073px;
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

