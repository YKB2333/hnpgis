<template>
  <div>
    <Header />
    <div id="main">
      <div class="container">
        <Menu />
        <div id="dataBox">
          <div class="clearfix" style="margin-bottom:34px;">
            <div class="localRankings fl">
              <h2 style="padding-left:31px;">警种服务访问排名</h2>
              <ul>
                <li
                  v-for="(item,idx) in assessList"
                  :class="[idx==assessListCurIdx?'active':'']"
                  @mouseenter="assessListMove(idx)"
                >
                  <div class="paimingBox">
                    <span :class="[true?'c'+(idx+1):false]">{{idx+1}}</span>
                    <i class="iconfont icon-paiming" :class="[true?'c'+(idx+1):false]"></i>
                  </div>
                  <span
                    :title="item.name"
                  >{{item.name.length>5?item.name.slice(0,5)+"...":item.name}}</span>
                  <span class="fr">{{item.count}}</span>
                </li>
              </ul>
            </div>
            <div class="res_ser fl clearfix">
              <h3>资源与服务总数</h3>
              <div
                class="f1 fl"
                :class="[1==res_serCurIdx?'active':'']"
                @mouseenter="res_serMove(1)"
              >
                <div class="o-div">
                  <h2>
                    <span :id="'n'+idx" class="num" v-for="(item,idx) in layerTypeNumber"></span>
                  </h2>
                  <i class="unit">{{layerTypeUnit}}</i>
                </div>

                <i class="iconfont icon-tuceng"></i>
                <div class="f1l fr">
                  <span>{{res_ser[0].type}}</span>
                  <!-- <strong>{{layerTypeNumber.join("")}}</strong> -->
                </div>
              </div>
              <div
                class="f1 fl"
                :class="[2==res_serCurIdx?'active':'']"
                @mouseenter="res_serMove(2)"
              >
                <div class="o-div">
                  <h2>
                    <span :id="'n'+idx" class="num" v-for="(item,idx) in layerNumber"></span>
                  </h2>
                  <i class="unit">{{res_ser[0].unit}}</i>
                </div>
                <i class="iconfont icon-jilu"></i>
                <div class="f1r fr">
                  <span>{{res_ser[0].num}}</span>
                </div>
              </div>
              <div
                class="f1 fl"
                :class="[3==res_serCurIdx?'active':'']"
                @mouseenter="res_serMove(3)"
              >
                <div class="o-div">
                  <h2>
                    <span :id="'n'+idx" class="num" v-for="(item,idx) in serviceTypeCount"></span>
                  </h2>
                  <i class="unit">种</i>
                </div>
                <i class="iconfont icon-zhonglei"></i>
                <div class="f1l fr">
                  <span>{{res_ser[1].type}}</span>
                </div>
              </div>
              <div
                class="f1 fl"
                :class="[4==res_serCurIdx?'active':'']"
                @mouseenter="res_serMove(4)"
              >
              <div class="o-div">
                  <h2>
                    <span :id="'n'+idx" class="num" v-for="(item,idx) in serviceCount"></span>
                  </h2>
                  <i class="unit">{{res_ser[1].unit+"次"}}</i>
                </div>
                <i class="iconfont icon-fangwencishu"></i>
                <div class="f1r fr">
                  <span>{{res_ser[1].num}}</span>
                </div>
              </div>
            </div>
            <div class="serviceRankings fl">
              <h2>服务访问排名</h2>
              <ul>
                <li
                  v-for="(item,idx) in visitList"
                  :class="[idx==visitListCurIdx?'active':'']"
                  @mouseenter="visitListMove(idx)"
                >
                  <div class="paimingBox">
                    <span :class="[true?'c'+(idx+1):false]">{{idx+1}}</span>
                    <i class="iconfont icon-paiming" :class="[true?'c'+(idx+1):false]"></i>
                  </div>
                  <span
                    :title="item.name"
                  >{{item.name.length>6?item.name.slice(0,6)+"...":item.name}}</span>
                  <span
                    :title="item.count"
                    :class="{c10:idx<3&&item.whether==1?true:false,c11:idx<3&&item.whether==-1?true:false,c12:idx>2||item.whether==0?true:false, fr:true}"
                  >{{item.count>999?(item.count+"").slice(0,2)+"...":item.count}}</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="clearfix">
            <div class="subLayer fl">
              <h2>图层数据有效率</h2>
              <ul>
                <li
                  v-for="(item,idx) in layerRateList"
                  :class="[idx==subLayerCurIdx?'active':'']"
                  @mouseenter="subLayerMove(idx)"
                >
                  <span :class="[true?'c'+(idx+1):false]">0{{idx+1}}</span>
                  <!-- //item.percent -->
                  <ol class="progressBox">
                    <dl>{{item.name}}</dl>
                    <dl>
                      <Progress :percent="item.percent" status="active"></Progress>
                    </dl>
                  </ol>
                  <div class="progressBig"></div>
                  <div class="total">
                    <div>总数</div>
                    <div>
                      <span
                        :title="item.count"
                      >{{item.count>9999&&item.name.length>2?(item.count+"").slice(0,3)+"...":(item.count>99999?(item.count+"").slice(0,4)+"...":item.count)}}</span>
                    </div>
                  </div>
                </li>
              </ul>
              <!-- {{item.count}} -->
            </div>
            <div class="res_trend fl">
              <h2>资源增量趋势</h2>
              <Echart :incrementList="incrementList" v-if="incrementList.length>0" />
            </div>
            <div class="serviceFrequency fl">
              <h2>服务访问频次</h2>
              <div class="serviceNum"></div>
              <span class="count">{{visitCount}}</span>
              <span class="unit">单位 ：{{visitUnit}}/小时</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Header from "../../components/rs_header/rs_header";
import Menu from "../../components/rs_menu/rs_menu";
import { setTimeout, setInterval, clearInterval } from "timers";
import Echart from "./echart";

export default {
  components: {
    Header,
    Menu,
    Echart
    // Service, PageHeader
  },
  data() {
    return {
      assessListCurIdx: 1,
      res_serCurIdx: 1,
      visitListCurIdx: 1,
      subLayerCurIdx: 1,
      layerRateList: [],
      incrementList: [],
      layerTypeNumber: [],
      layerTypeUnit: "种",
      layerNumber: [],
      assessList: [],
      serviceCount: [],
      serviceTypeCount: [],
      serviceTypeUnit: "种",
      visitCount: [],
      visitUnit: "",
      visitList: [],
      res_ser: [
        {
          type: "图层类型",
          num: "记录条数",
          unit: "条"
        },
        {
          type: "服务类型",
          num: "访问次数",
          unit: "次"
        }
      ],
      cirColor: [
        {
          h: "rgb(29, 255, 119)",
          l: "rgba(29, 255, 119,.5)"
        },
        {
          h: "rgb(131, 255, 198)",
          l: "rgba(131, 255, 198, .5)"
        },
        {
          h: "rgb(9, 255, 255)",
          l: "rgba(9, 255, 255, .5)"
        },
        {
          h: "rgb(255, 255, 255)",
          l: "rgba(255, 255, 255, .5)"
        }
      ]
    };
  },
  created() {
    this.init();
  },
  computed: {},
  methods: {
    init() {
      var url = this.$config.baseUrl.dev;
      // console.log(url)
      this.$axios.get(url + "/index/reStatistic").then(res => {
        let {
          data: { data, status }
        } = res;
        if (status === 1) {
          console.log(data);
          //资源
          this.layerTypeNumber = this.split(
            this.tranNumber2(data.layerTypeNumber, 0, "种")
              .num.toString()
              .padStart(2, "0")
          );
          this.layerTypeUnit = this.tranNumber2(
            data.layerTypeNumber,
            0,
            "种"
          ).unit;

          this.layerNumber = this.split(
            this.tranNumber(data.layerNumber, 0).num
          );
          this.res_ser[0].unit = this.tranNumber(data.layerNumber, 0).unit;

          this.layerRateList = data.layerRateList.splice(0, 4);
          console.log(this.layerRateList);
          var percentArr = [];
          this.layerRateList.map(item => {
            percentArr.push(item.percent);
          });
          // this.circleAnimation(percentArr);
          this.incrementList = data.incrementList;
        }
      });
      this.$axios.get(url + "/index/seStatistic").then(res => {
        // console.log(res)
        let {
          data: { data, status }
        } = res;
        if (status === 1) {
          this.assessList = data.assessList;
          //服务
          this.serviceTypeCount = this.split(
            this.tranNumber2(data.serviceTypeCount, 0, "种")
              .num.toString()
              .padStart(2, "0")
          ); //补零
          this.serviceTypeUnit = this.tranNumber2(
            data.serviceTypeCount,
            0,
            "种"
          ).unit;
          // console.log(data.serviceCount);
          this.serviceCount = this.split(
            this.tranNumber(data.serviceCount, 0).num
          );
          this.res_ser[1].unit = this.tranNumber(data.serviceCount, 0).su;
          this.visitCount = this.tranNumber3(data.visitCount).num;
          this.visitUnit = this.tranNumber3(data.visitCount).su + "次";

          this.visitList = data.visitList;
        }
      });
      this.timer1 = setInterval(() => {
        this.$axios.get(url + "/index/reStatistic").then(res => {
          let {
            data: { data, status }
          } = res;
          if (status === 1) {
            console.log(data);
            //资源
            this.layerTypeNumber = this.split(
              this.tranNumber2(data.layerTypeNumber, 0, "种")
                .num.toString()
                .padStart(2, "0")
            );
            this.layerTypeUnit = this.tranNumber2(
              data.layerTypeNumber,
              0,
              "种"
            ).unit;

            this.layerNumber = this.split(
              this.tranNumber(data.layerNumber, 0).num
            );
            this.res_ser[0].unit = this.tranNumber(data.layerNumber, 0).unit;

            this.layerRateList = data.layerRateList.splice(0, 4);
            var percentArr = [];
            this.layerRateList.map(item => {
              percentArr.push(item.percent);
            });
            // this.circleAnimation(percentArr);
            this.incrementList = data.incrementList;
          }
        });
        this.$axios.get(url + "/index/seStatistic").then(res => {
          // console.log(res)
          let {
            data: { data, status }
          } = res;
          if (status === 1) {
            this.assessList = data.assessList;
            //服务
            this.serviceTypeCount = this.split(
              this.tranNumber2(data.serviceTypeCount, 0, "种")
                .num.toString()
                .padStart(2, "0")
            ); //补零
            this.serviceTypeUnit = this.tranNumber2(
              data.serviceTypeCount,
              0,
              "种"
            ).unit;
            // console.log(data.serviceCount);
            this.serviceCount = this.split(
              this.tranNumber(data.serviceCount, 0).num
            );
            this.res_ser[1].unit = this.tranNumber(data.serviceCount, 0).su;
            this.visitCount = this.tranNumber3(data.visitCount).num;
            this.visitUnit = this.tranNumber3(data.visitCount).su + "次";
            this.visitList = data.visitList;
          }
        });
      }, 10000);
    },
    split(num) {
      var str = num + "";
      var arr = str.split("");
      return arr;
    },
    //数字转化万和亿
    tranNumber(num, point) {
      let numStr = num.toString();
      if (numStr.length < 5) {
        return { num: numStr, unit: "条", su: "" };
      } else if (numStr.length > 8) {
        let decimal = numStr.substring(
          numStr.length - 8,
          numStr.length - 8 + point
        );
        return {
          num: parseFloat(parseInt(num / 100000000) + "." + decimal),
          unit: "亿条",
          su: "亿"
        };
      } else if (numStr.length > 4) {
        let decimal = numStr.substring(
          numStr.length - 4,
          numStr.length - 4 + point
        );
        return {
          num: parseFloat(parseInt(num / 10000) + "." + decimal),
          unit: "万条",
          su: "万"
        };
      }
    },
    //数字转化千和百万
    tranNumber2(num, point, unit) {
      let numStr = num.toString();
      if (numStr.length < 4) {
        return { num: numStr, unit: unit };
      } else if (numStr.length > 6) {
        let decimal = numStr.substring(
          numStr.length - 6,
          numStr.length - 6 + point
        );
        return {
          num: parseFloat(parseInt(num / 1000000) + "." + decimal),
          unit: "百万" + unit
        };
      } else if (numStr.length > 3) {
        let decimal = numStr.substring(
          numStr.length - 3,
          numStr.length - 3 + point
        );
        return {
          num: parseFloat(parseInt(num / 1000) + "." + decimal),
          unit: "千" + unit
        };
      }
    },
    //数字转化万和亿
    tranNumber3(num, point) {
      let numStr = num.toString();
      if (numStr.length < 6) {
        return { num: numStr, unit: "条", su: "" };
      } else if (numStr.length > 8) {
        let decimal = numStr.substring(
          numStr.length - 8,
          numStr.length - 8 + point
        );
        return {
          num: parseFloat(parseInt(num / 100000000) + "." + decimal),
          unit: "亿条",
          su: "亿"
        };
      } else if (numStr.length > 5) {
        let decimal = numStr.substring(
          numStr.length - 4,
          numStr.length - 4 + point
        );
        return {
          num: parseFloat(parseInt(num / 10000) + "." + decimal),
          unit: "万条",
          su: "万"
        };
      }
    },
    //定时加载进度环动画,清除动画
    // circleAnimation(percent) {
    //   this.timer2 = setInterval(() => {
    //     this.layerRateList.map((item, idx) => {
    //       item.percent = 0;
    //     });
    //     setTimeout(() => {
    //       this.layerRateList.map((item, idx) => {
    //         // item.percent = percent[idx];
    //         item.percent = 80;
    //       });
    //     }, 1000);
    //   }, 5000);
    // },
    assessListMove(idx) {
      this.assessListCurIdx = idx;
    },
    res_serMove(idx) {
      this.res_serCurIdx = idx;
    },
    visitListMove(idx) {
      this.visitListCurIdx = idx;
    },
    subLayerMove(idx) {
      this.subLayerCurIdx = idx;
    },
    //递增
    dizeng() {
      // this.$refs.layerTypeNumber2.innerHTML = 1
      var odiv = document.getElementsByClassName("o-div")[0];
      var oS0 = odiv.getElementsByClassName("num");
      if (oS0) {
        setTimeout(() => {
          for (var i = 0; i < oS0.length; i++) {
            oS0[i].className =
              oS0[i].className + ` num-${this.layerTypeNumber[i]}`;
          }
        }, 1000);
      }
      var odiv = document.getElementsByClassName("o-div")[1];
      var oS1 = odiv.getElementsByClassName("num");
      if (oS1) {
        setTimeout(() => {
          for (var i = 0; i < oS1.length; i++) {
            oS1[i].className = oS1[i].className + ` num-${this.layerNumber[i]}`;
          }
        }, 1000);
      }
      var odiv = document.getElementsByClassName("o-div")[2];
      var oS2 = odiv.getElementsByClassName("num");
      if (oS2) {
        setTimeout(() => {
          for (var i = 0; i < oS2.length; i++) {
            oS2[i].className =
              oS2[i].className + ` num-${this.serviceTypeCount[i]}`;
          }
        }, 1000);
      }
      var odiv = document.getElementsByClassName("o-div")[3];
      var oS3 = odiv.getElementsByClassName("num");
      if (oS3) {
        setTimeout(() => {
          for (var i = 0; i < oS3.length; i++) {
            oS3[i].className =
              oS3[i].className + ` num-${this.serviceCount[i]}`;
          }
        }, 1000);
      }
    }
  },
  mounted() {
    this.dizeng();
  },
  // beforeRouteEnter(to, from, next) {
  //   function getCookie(key) {
  //     var str = document.cookie;
  //     var arr = str.split("; ");
  //     for (var i = 0; i < arr.length; i++) {
  //       var arr2 = arr[i].split("=");
  //       if (key == arr2[0]) {
  //         return arr2[1];
  //       }
  //     }
  //   }
  //   // console.log(getCookie("user"));
  //   if (getCookie("user")) {
  //     next();
  //   } else {
  //     // console.log("loading");
  //     window.location.href = "http://www.pgis.hn/pgismap/login.html";
  //   }
  // },
  destroyed() {
    clearInterval(this.timer1);
    clearInterval(this.timer2);
  }
};
</script>
<style scoped lang="less">
@font-face {
  font-family: "myFont";
  src: url("../../assets/font/PingFang SC Regular.ttf");
  font-weight: normal;
  font-style: normal;
}
#main {
  font-family: monospace;
}
#main .container {
  background: none;
  
}
#main .container #dataBox {
  height:972px;
}
#dataBox {
  margin-top: -96px;
  margin-left: -190px;
  transform: scale(0.75);

  h2 {
    width: 430px;
    height: 52px;
    padding-left: 31px;
    font-size: 26px;
    font-weight: 600;
    color: #00e7ff;
    line-height: 52px;
    background: url("../../assets/images/hnimages/rankings.png") no-repeat;
  }
  .serviceRankings {
    ul {
      li {
        margin-bottom: 8px;
        padding-left: 6px;
        background-color: rgba(10, 54, 130, 0.4);
        border-radius: 8px;
      }
    }
  }

  .localRankings,
  .serviceRankings {
    // width: 250px;
    // height: 298px;

    background-size: cover;
    ul {
      margin-top: 12px;
      margin-left: 2px;
      width: 430px;
      height: 385px;
      background: rgba(10, 54, 130, 0.4);
      .active {
        background: rgba(0, 231, 255, 0.3);
      }
      li {
        position: relative;
        height: 62px;
        line-height: 70px;
        overflow: hidden;
        padding: 0 41px 0 42px;

        .paimingBox {
          position: relative;
          display: inline-block;
          width: 29px;
          height: 37px;
          margin: 0 35px 0 0;
        }
        i {
          position: absolute;
          left: 0;
          top: 0;
          font-size: 32px;
          color: #54c4f9;
          &.c1 {
            color: #e15847;
          }
          &.c2 {
            color: #e89555;
          }
          &.c3 {
            color: #e8d965;
          }
        }
        span {
          vertical-align: middle;
          color: #092356;
          &:nth-child(1) {
            font-size: 20px;
            font-weight: bold;
            margin-right: 16px;
            position: absolute;
            z-index: 10;
            left: 10px;
            top: 2px;
          }
          &:nth-child(2) {
            font-size: 22px;
            color: #54c4f9;
            // margin-right: 69px;
          }
          &:nth-child(3) {
            font-size: 30px;
            color: #54c4f9;
            font-family: fantasy;
          }
          &.c10,
          &.c11,
          &.c12 {
            &::after {
              content: url(../../assets/images/hnimages/upArrow.png);
              display: inline-block;
              width: 20px;
              height: 20px;
              padding-left: 9px;
            }
          }
          &.c11::after {
            content: url(../../assets/images/hnimages/downArrow.png);
          }
          &.c12::after {
            content: "";
          }
        }
        &:nth-child(1),
        &:nth-child(2),
        &:nth-child(3) {
          span:nth-child(2) {
            color: #fff;
          }
          span:nth-child(3) {
            color: #fff;
          }
        }
      }
    }
  }
  .serviceRankings {
    ul {
      background-color: transparent;
      li {
        height: 68px;
      }
    }
  }
  .res_ser {
    margin: 0 34px 0 34px;
    width: 677px;
  }
  .res_trend {
    width: 677px;
    margin: 0 34px 0 34px;
  }
  .res_ser,
  .res_trend {
    h2 {
      width: 480px;
      height: 52px;
      line-height: 52px;
      padding-left: 18px;
      background: url("../../assets/images/hnimages/rankings.png") center
        no-repeat;
      background-size: 102% 130%;
    }
    h3 {
      width: 677px;
      height: 52px;
      line-height: 52px;
      margin-bottom: 12px;
      padding: 0;
      color: #00e7ff;
      font-size: 28px;
      text-align: center;
      font-weight: 600;
      background: url("../../assets/images/hnimages/res_ser.png") center
        no-repeat;
    }
    ul {
      display: inline-block;
      li {
        float: left;
        width: 52px;
        height: 73px;
        margin: 0 7px 0 0;
        border-radius: 4px;
        border: 1px solid #a3f6f8;
        font-size: 48px;
        font-weight: bold;
        text-align: center;
      }
      &.fl_r {
        color: #1dff77;
      }
      &.fl_n {
        color: #09ffff;
        li:last-child {
          margin-right: 0;
        }
      }
    }
    .f1 {
      position: relative;

      width: 338px;
      height: 188px;
      margin: 0 0px 10px 0;
      background: url("../../assets/images/hnimages/f1.png") center no-repeat;
      &.active {
        background: url("../../assets/images/hnimages/activef1.png") center
          no-repeat;
      }
      &:nth-child(2) {
        background: url("../../assets/images/hnimages/rotatef1.png") center
          no-repeat;
        &.active {
          background: url("../../assets/images/hnimages/activerotatef1.png")
            center no-repeat;
        }
      }
      &:nth-child(5) {
        background: url("../../assets/images/hnimages/rotatef1.png") center
          no-repeat;
        &.active {
          background: url("../../assets/images/hnimages/activerotatef1.png")
            center no-repeat;
        }
      }
      i {
        font-size: 72px;
        color: #55c2f9;
        margin: 56px 0 0 37px;
        display: inline-block;
      }
      .f1l,
      .f1r {
        // width:40%;
        width: 200px;
        span:first-child {
          display: inline-block;
          width: 100%;
          margin: 45px 0 0 0;
          font-size: 26px;
          color: #f5d38a;
        }
        span:last-child {
          display: inline-block;
          width: 100%;
          margin: 45px 0 0 0;
          font-size: 26px;
          color: #f5d38a;
        }
        strong {
          font-size: 70px;
          color: #fff;
          font-family: fantasy;
          line-height: 70px;
        }
      }
    }
    span {
      // padding-right: 94px;
      font-size: 12px;
      color: rgba(255, 255, 255, 1);
      &.u2 {
        padding: 0;
        float: right;
      }
    }
  }
  .serviceRankings {
    //background: url("../../assets/images/hnimages/rankings_reverse.png");
    background-size: cover;
  }
  .subLayer,
  .serviceFrequency {
    height: 274px;
    //background: url("../../assets/images/hnimages/subLayer.png") no-repeat;
    background-size: 100% 100%;
  }
  .subLayer {
    ul {
      margin-top: 11px;
      width: 432px;
      background-color: rgba(10, 54, 130, 0.4);
      border-radius: 8px;
      & > li {
        position: relative;
        padding: 16px 10px 0 26px;
        height: 74px;
        &.active {
          background-color: rgba(0, 231, 255, 0.3);
        }
        span {
          display: inline-block;
          font-size: 24px;
          color: #57c4fa;
          vertical-align: top;
          padding-right: 26px;
        }
        .progressBig {
          position: absolute;
          top: 43px;
          left: 72px;
          border-radius: 9px;
          width: 194px;
          height: 18px;
          border: 1px solid rgba(99, 180, 215, 1);
        }
        .progressBox {
          display: inline-block;
          overflow: hidden;
          margin-top: -10px;
          margin-right: 27px;
          dl {
            height: 30px;
            width: 239px;

            &:first-child {
              color: #f5d38a;
              font-size: 26px;
            }
          }
        }
        .total {
          display: inline-block;
          height: 60px;
          vertical-align: top;
          margin-top: 1px;
          div:first-child {
            color: rgba(255, 255, 255, 0.5);
            font-weight: 400;
            font-size: 14px;
            font-family: fantasy;
          }
          div:last-child {
            vertical-align: bottom;
            line-height: 24px;
            span {
              font-size: 24px;
              padding-right: 0;
              font-family: fantasy;
            }
          }
        }
      }
    }
  }
  .serviceFrequency {
    position: relative;
    margin-left: 5px;
    //background: url("../../assets/images/hnimages/subLayer_reverse.png");
    background-size: 100% 100%;
    .serviceNum {
      margin: 16px auto;
      width: 289px;
      height: 289px;
      background: url("../../assets/images/hnimages/grid.png") center no-repeat;
      text-align: center;
      animation: que 4s linear infinite;
    }
    .unit {
      position: absolute;
      bottom: -83px;
      right: 144px;
      font-size: 16px;
      color: #fff;
    }
    .count {
      display: inline-block;
      width: 289px;
      position: absolute;
      text-align: center;
      bottom: 18px;
      right: 68px;
      font-size: 60px;
      color: #fff;
      font-family: fantasy;
    }
  }
}

//数字滚动动画
#dataBox .o-div {
  position: absolute;
  top: -8px;
  left: 12px;
  margin: 100px;
  width: 223px;
  h2 {
    height: 70px;
    width: auto;
    background: none;
    position: relative;
    display: inline-block;
    vertical-align: baseline;
  }
  i.unit {
    display: inline-block;
    font-size: 20px;
    font-weight: 400;
    /* padding-left: 12px; */
    color: #fff;
    margin: 0;
    vertical-align: middle;
    height: 59px;
  }
  span {
    font-size: 70px;
    color: #fff;
    font-family: fantasy;
    line-height: 70px;
    width: 40px;
    display: inline-block;
    height: 70px;
    overflow: hidden;
    position: relative;
  }
  span:before {
    content: "0123456789";
    display: block;
    width: 40px;
    line-height: 70px;
    top: 0px;
    word-break: break-all;
    position: absolute;
    display: block;
  }
  span.num-0:before {
    transition: top 1.2s ease-in;
    top: -0px;
  }
  span.num-1:before {
    transition: top 1.2s ease-in;
    top: -70px;
  }
  span.num-2:before {
    transition: top 1.2s ease-in;
    top: -140px;
  }
  span.num-3:before {
    transition: top 1.2s ease-in;
    top: -210px;
  }
  span.num-4:before {
    transition: top 1.2s ease-in;
    top: -280px;
  }
  span.num-5:before {
    transition: top 1.2s ease-in;
    top: -350px;
  }
  span.num-6:before {
    transition: top 1.2s ease-in;
    top: -420px;
  }
  span.num-7:before {
    transition: top 1.2s ease-in;
    top: -490px;
  }
  span.num-8:before {
    transition: top 1.2s ease-in;
    top: -560px;
  }
  span.num-9:before {
    transition: top 1.2s ease-in;
    top: -630px;
  }
}

@keyframes que {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

