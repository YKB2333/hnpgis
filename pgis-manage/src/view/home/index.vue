<template>
  <div>
    <Header />
    <div id="main">
      <div class="container">
        <Menu />
        <div id="dataBox">
          <div class="clearfix" style="margin-bottom:80px;">
            <div class="localRankings fl">
              <h2 style="padding-left:50px;">警种服务访问排名</h2>
              <ul>
                <li v-for="(item,idx) in assessList">
                  <span :class="[true?'c'+(idx+1):false]">0{{idx+1}}</span>
                  <span>{{item.name}}</span>
                  <span class="fr">{{item.count}}</span>
                  <i
                    class="iconfont iconjinxunzhang"
                    :class="[true?'c'+(idx+1):false]"
                    v-if="idx<3"
                  ></i>
                </li>
              </ul>
            </div>
            <div class="res_ser fl">
              <h2>资源与服务总数</h2>
              <div class="f1">
                <div class="clearfix">
                  <ul class="fl_r fl clearfix" ref="TypeNumber">
                    <li v-for="item in layerTypeNumber">{{item}}</li>
                  </ul>
                  <ul class="fl_n fr clearfix" ref="Number">
                    <li v-for="item in layerNumber">{{item}}</li>
                  </ul>
                </div>
                <div>
                  <span>{{res_ser[0].type}}(单位:{{this.layerTypeUnit}})</span>
                  <span>{{res_ser[0].num}}(单位:{{res_ser[0].unit}})</span>
                </div>
              </div>
              <div class="f1">
                <div class="clearfix">
                  <ul class="fl_r fl clearfix" ref="TypeCount">
                    <li v-for="item in serviceTypeCount">{{item}}</li>
                  </ul>
                  <ul class="fl_n fr clearfix" ref="Count">
                    <li v-for="item in serviceCount">{{item}}</li>
                  </ul>
                </div>
                <div>
                  <span>{{res_ser[1].type}}(单位:{{this.serviceTypeUnit}})</span>
                  <span>{{res_ser[1].num}}(单位:{{res_ser[1].unit}})</span>
                </div>
              </div>
            </div>
            <div class="serviceRankings fl">
              <h2>服务访问排名</h2>
              <ul>
                <li v-for="(item,idx) in visitList">
                  <span>0{{idx+1}}</span>
                  <span :title="item.name">{{item.name.slice(0,6)+"..."}}</span>
                  <span
                    :class="{c10:idx<3&&item.whether==1?true:false,c11:idx<3&&item.whether==2?true:false,c12:idx>2||item.whether==0?true:false, fr:true}"
                  >{{item.count}}</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="clearfix">
            <div class="subLayer fl">
              <h2>图层采集空间率</h2>
              <ul>
                <li v-for="(item,idx) in layerRateList">
                  <div :class="[true?'element'+(idx+1):false]">
                    <div :class="[true?'child'+(idx+1):false]"></div>
                  </div>
                  <span :class="[true?'c'+(idx+1):false]">{{idx+1}}</span>
                  <div class="circleBox">
                    <i-circle
                      :percent="item.percent"
                      :size="40"
                      :stroke-width="14"
                      :trail-width="6"
                      :stroke-color="cirColor[idx].h"
                      :trail-color="cirColor[idx].l"
                      style="vertical-align:middle;"
                    >
                      <span
                        class="demo-Circle-inner"
                        style="font-size:10px;font-weight:bold;color:#1dff77;line-height:40px;"
                      >{{item.percent}}%</span>
                    </i-circle>
                  </div>
                  <span>{{item.name}}/{{tranNumber3(item.count,0).num+tranNumber3(item.count,0).su}}</span>
                </li>
              </ul>
              <!-- {{item.count}} -->
            </div>
            <div class="res_trend fl">
              <h2>资源增量趋势</h2>
              <Echart :incrementList="incrementList" />
            </div>
            <div class="serviceFrequency fl">
              <h2>服务访问频次</h2>
              <div class="serviceNum">
                <div class="fl sl"></div>
                <div class="sc">
                  <i
                    v-for="item in visitCount"
                    class="iconfont"
                    :class="[item==0?'iconicon-test':'iconicon-test'+item]"
                  ></i>
                </div>
                <span class="unit">单位 ：{{visitUnit}}/小时</span>
                <div class="fr sr"></div>
              </div>
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
import { setTimeout } from "timers";
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
      layerRateList: [],
      incrementList: [],
      layerTypeNumber: [],
      layerTypeUnit:"种",
      layerNumber: [],
      assessList: [],
      serviceCount: [],
      serviceTypeCount: [],
      serviceTypeUnit:"种",
      visitCount: [],
      visitUnit: "",
      visitList: [],
      res_ser: [
        {
          type: "资源类型",
          num: "记录条例",
          unit: "条"
        },
        {
          type: "服务类型",
          num: "访问次数",
          unit: "条"
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
          //资源
          this.layerTypeNumber = this.split(
            this.tranNumber2(data.layerTypeNumber,0,"种").num.toString().padStart(2, "0")
          );
          this.layerTypeUnit = this.tranNumber2(data.layerTypeNumber,0,"种").unit;

          this.layerNumber = this.split(
            this.tranNumber(data.layerNumber, 0).num
          );
          this.res_ser[0].unit = this.tranNumber(data.layerNumber, 0).unit;

          this.layerRateList = data.layerRateList;
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
            this.tranNumber2(data.serviceTypeCount,0,"种").num.toString().padStart(2, "0")
          ); //补零
          this.serviceTypeUnit = this.tranNumber2(data.serviceTypeCount,0,"种").unit;

          this.serviceCount = this.split(
            this.tranNumber(data.serviceCount).num
          );
          this.res_ser[1].unit = this.tranNumber(data.serviceCount).unit;

          if (data.visitCount > 10000 && data.visitCount < 100000) {
            this.visitCount = this.split(data.visitCount / 10000);
            this.visitUnit = "万次";
          } else if (data.visitCount > 100000 && data.visitCount < 1000000) {
            this.visitCount = this.split(data.visitCount / 10000);
            this.visitUnit = "万次";
          } else if (data.visitCount > 1000000 && data.visitCount < 10000000) {
            this.visitCount = this.split(parseInt(data.visitCount / 10000));
            this.visitUnit = "万次";
          } else if (
            data.visitCount > 10000000 &&
            data.visitCount < 100000000
          ) {
            this.visitCount = this.split(data.visitCount / 10000000);
            this.visitUnit = "千万次";
          } else {
            this.visitCount = this.split(data.visitCount);
            this.visitUnit = "次";
          }
          this.visitList = data.visitList;
        }
      });
    },
    split(num) {
      var str = num + "";
      var arr = str.split("");
      return arr;
    },
    //数字转化十万和百亿
    tranNumber(num, point) {
      let numStr = num.toString();
      if (numStr.length < 6) {
        return { num: numStr, unit: "条",su:"" };
      } else if (numStr.length > 10) {
        let decimal = numStr.substring(
          numStr.length - 10,
          numStr.length - 10 + point
        );
        return {
          num: parseFloat(parseInt(num / 10000000000) + "." + decimal),
          unit: "百亿条",
          su:"百亿"
        };
      } else if (numStr.length > 5) {
        let decimal = numStr.substring(
          numStr.length - 5,
          numStr.length - 5 + point
        );
        return {
          num: parseFloat(parseInt(num / 100000) + "." + decimal),
          unit: "十万条",
          su:"十万"
        };
      }
    },
    //数字转化千和百万
    tranNumber2(num, point,unit) {
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
          unit: "百万"+unit
        };
      } else if (numStr.length > 3) {
        let decimal = numStr.substring(
          numStr.length - 3,
          numStr.length - 3 + point
        );
        return {
          num: parseFloat(parseInt(num / 1000) + "." + decimal),
          unit: "千"+unit
        };
      }
    },
        //数字转化万和亿
    tranNumber3(num, point) {
      let numStr = num.toString();
      if (numStr.length < 6) {
        return { num: numStr, unit: "条",su:"" };
      } else if (numStr.length > 8) {
        let decimal = numStr.substring(
          numStr.length - 8,
          numStr.length - 8 + point
        );
        return {
          num: parseFloat(parseInt(num / 100000000) + "." + decimal),
          unit: "亿条",
          su:"亿"
        };
      } else if (numStr.length > 5) {
        let decimal = numStr.substring(
          numStr.length - 4,
          numStr.length - 4 + point
        );
        return {
          num: parseFloat(parseInt(num / 10000) + "." + decimal),
          unit: "万条",
          su:"万"
        };
      }
    },
  }
};
</script>
<style scoped lang="less">
#dataBox {
  h2 {
    padding-left: 26px;
    font-size: 20px;
    font-weight: bold;
    color: #c0e5ff;
    letter-spacing: 4px;
    text-align: center;
    line-height: 42px;
  }
  .serviceRankings {
    ul {
      li {
        margin-bottom: 8px;
        padding-left: 6px;
        &:nth-child(1) {
          background-color: rgba(20, 110, 198, 0.7);
        }
        &:nth-child(2) {
          background-color: rgba(20, 110, 198, 0.7);
        }
        &:nth-child(3) {
          background-color: rgba(20, 110, 198, 0.4);
        }
      }
    }
  }

  .localRankings,
  .serviceRankings {
    width: 250px;
    height: 298px;
    background: url("../../assets/images/hnimages/rankings.png");
    background-size: cover;
    ul {
      margin-top: 12px;
      margin-left: 20px;
      width: 215px;
      height: 218px;
      // background:red;
      li {
        position: relative;
        i {
          position: absolute;
          left: 0;
          top: 0;
          font-size: 22px;
          &.c1 {
            color: #ffd21c;
          }
          &.c2 {
            color: #e8e8e8;
          }
          &.c3 {
            color: #eeb4a9;
          }
        }
        span {
          vertical-align: middle;
          &:nth-child(1) {
            font-size: 20px;
            font-weight: bold;
            color: #ffffff;
            margin-right: 16px;
          }
          &:nth-child(2) {
            font-size: 16px;
            color: #ffffff;
            // margin-right: 69px;
          }
          &:nth-child(3) {
            font-size: 20px;
            font-weight: bold;
            color: #ffffff;
          }
          &.c1 {
            color: #ffd21c;
          }
          &.c2 {
            color: #e8e8e8;
          }
          &.c3 {
            color: #eeb4a9;
          }
          &.c4,
          &.c5,
          &.c6,
          &.c7,
          &.c1,
          &.c2,
          &.c3 {
            &::before {
              content: "";
              display: inline-block;
              width: 22px;
              height: 22px;
              margin-right: 9px;
              vertical-align: sub;
            }
          }
          // &.c1,
          // &.c2,
          // &.c3 {
          //   &::before {
          //     content: url(../../assets/images/hnimages/medal.png);
          //   }
          // }
          &.c10,
          &.c11,
          &.c12 {
            &::after {
              content: url(../../assets/images/hnimages/upArrow.png);
              display: inline-block;
              width: 20px;
              height: 20px;
              vertical-align: text-top;
            }
          }
          &.c11::after {
            content: url(../../assets/images/hnimages/downArrow.png);
          }
          &.c12::after {
            content: "";
          }
        }
      }
    }
  }
  .res_ser {
    margin: 0 35px 0 35px;
  }
  .res_trend {
    margin: 0 27px 0 27px;
  }
  .res_ser,
  .res_trend {
    h2 {
      width: 480px;
      height: 32px;
      margin-top: 6px;
      margin-bottom: 38px;
      line-height: 32px;
      padding: 0;
      background: url("../../assets/images/hnimages/res_ser.png") center
        no-repeat;
      background-size: 102% 130%;
    }
    ul {
      li {
        float: left;
        width: 52px;
        height: 73px;
        margin: 0 7px 10px 0;
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
      margin-bottom: 16px;
    }
    span {
      padding-right: 94px;
      font-size: 12px;
      color: rgba(255, 255, 255, 1);
    }
  }
  .serviceRankings {
    background: url("../../assets/images/hnimages/rankings_reverse.png");
    background-size: cover;
  }
  .subLayer,
  .serviceFrequency {
    width: 258px;
    height: 274px;
    background: url("../../assets/images/hnimages/subLayer.png") no-repeat;
    background-size: 100% 100%;
  }
  .subLayer {
    ul {
      margin-top: 22px;
      margin-left: 23px;
      width: 215px;
      height: 218px;
      // background:red;
      li {
        margin-bottom: 8px;
        .element1,
        .element2,
        .element3,
        .element4 {
          display: inline-block;
          width: 15px;
          height: 15px;
          margin-right: 15px;
          border: 1px solid #1dff77;
          border-radius: 50%;
          vertical-align: middle;
          .child1,
          .child2,
          .child3 {
            width: 11px;
            height: 11px;
            margin: 0.8px 0 0 1.2px;
            border: 1px solid #1dff77;
            border-radius: 50%;
          }
        }
        .element2 {
          border-color: #83ffc6;

          .child2 {
            border-color: #83ffc6;
          }
        }

        .element3 {
          border-color: #09ffff;
          .child3 {
            border-color: #09ffff;
          }
        }

        .element4 {
          border-color: transparent;

          .child4 {
            border-color: transparent;
          }
        }

        span {
          vertical-align: middle;
          &:nth-child(2) {
            font-size: 20px;
            font-weight: bold;
            color: #ffffff;
            margin-right: 20px;
          }
          &.c1 {
            color: #1dff77;
          }
          &.c2 {
            color: #83ffc6;
          }
          &.c3 {
            color: #09ffff;
          }
          &:nth-child(4) {
            font-size: 16px;
            color: #fff;
          }
        }
        .circleBox {
          display: inline-block;
          margin-right: 20px;
        }
      }
    }
  }
  .serviceFrequency {
    position: relative;
    margin-left: 5px;
    background: url("../../assets/images/hnimages/subLayer_reverse.png");
    background-size: 100% 100%;
    .serviceNum {
      margin: 46px auto;
      width: 153px;
      height: 125px;
      background: url("../../assets/images/hnimages/grid.png") center no-repeat;
      text-align: center;
      .sl,
      .sr {
        width: 12px;
        height: 125px;
        background: url("../../assets/images/hnimages/grid_l.png") center
          no-repeat;
      }
      .sr {
        background: url("../../assets/images/hnimages/grid_r.png") center
          no-repeat;
      }
      .sc {
        display: inline-block;
        line-height: 125px;
        padding-right: 6px;
        i {
          font-size: 32px;
          color: #a3f6f8;
          margin-right: -8px;
        }
      }
      .unit {
        position: absolute;
        bottom: 44px;
        right: 90px;
        font-size: 10px;
        color: #fff;
      }
    }
  }
}
</style>

