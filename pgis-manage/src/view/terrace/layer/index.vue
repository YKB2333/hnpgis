<template>
  <div>
    <!-- 专用 -->
    <!-- 图格展示 -->
    <!-- <div class="gridShow" v-show="curOperate===1">
      <ul class="clearfix content">
        <li v-for="item in data3">
          <div>
            <div class="clearfix">
              <span class="fl place">{{item.name}}</span>
              <i class="iconfont icongongan fr"></i>
            </div>
            <div class="clearfix">
              <span class="fl num">{{item.count}}</span>
              <span class="fr source">数据来源:{{item.origin}}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>-->
    <Scroll
      :on-reach-bottom="moreLoad"
      :distance-to-edge="offset"
      :loading-text="loadingText"
      v-show="curOperate===1"
      :height="550"
    >
      <div class="gridShow">
        <ul class="clearfix content">
          <li v-for="item in data3">
            <div>
              <div class="clearfix">
                <span class="fl place">{{item.name}}</span>
                <i class="iconfont icongongan fr"></i>
              </div>
              <div class="clearfix">
                <span class="fl num">{{item.count}}</span>
                <span class="fr source">数据来源:{{item.origin}}</span>
              </div>
            </div>
          </li>
          <!-- <li class="loading"> {{loadingText}}</li> -->
        </ul>
      </div>
    </Scroll>
    <!-- 滚动条 -->
    <!-- <div id="drag" v-show="curOperate===1&&scrollStatus===true">
      <div class="bar"></div>
    </div>-->
    <!-- 列表展示 -->
    <!-- <Scroll
      :on-reach-bottom="moreLoad"
      height="500"
      v-if="curOperate===0&&responsePages>1"
      :distance-to-edge="offset"
      :loading-text="loadingText"
    >
      <div class="tableBox tb tb1">
        <Table
          :show-header="false"
          :disabled-hover="false"
          :row-class-name="rowClassName"
          :columns="columns3"
          :data="data3"
          width="1045"
          :height="data3Height"
        ></Table>
      </div>
      <span class="loading">下拉加载更多</span>
    </Scroll>-->

    <div class="tableBox tb tb1" v-if="curOperate===0">
      <Table
        :disabled-hover="false"
        :row-class-name="rowClassName"
        :columns="columns3"
        :data="data3"
        width="1034"
      ></Table>
      <div class="divide">
        <Page :total="total" :current="curPage" simple @on-change="changePage" />
      </div>
    </div>
  </div>
</template>
<script>
import "./layer.less";
export default {
  props: [
    "curOperate",
    "columns3",
    "data3",
    "scrollStatus",
    "moreLoad",
    "responseTotal",
    "changePage",
    "curPage",
    "loadingText"
  ],
  data() {
    return {
      data1Height: "",
      offset: 14
    };
  },
  computed: {
    total() {
      return Number(this.responseTotal);
    }
  },
  methods: {
    jump(idx) {
      this.curSource = idx;
    },
    rowClassName: function(row, index) {
      if (index % 2 == 0) {
        return "ivu-table-stripe-even";
      } else return "ivu-table-stripe-odd";
    }
    // getBoxHeight() {
    //   // return 200
    //   let offsetHeight = document.querySelector(".tb1").offsetHeight;
    //   console.log(offsetHeight);
    //   if (offsetHeight < 523) {
    //     return offsetHeight;
    //   } else {
    //     return 523;
    //   }
    // },
  },
  created() {
    // this.data1Height = this.getBoxHeight();
  },
  mounted() {
    //计算分页input的宽度
    var divideInput = document.getElementsByClassName(
      "ivu-page-simple-pager"
    )[0].children[0];
    var beishu = (this.total / 10 + "").length;
    console.log(beishu);
    divideInput.style.width = 30 + 3 * beishu + "px";
  }
};
</script>
<style lang="less" scoped>
.gridShow {
  // position: relative;
  width: 1073px;
  // height: 550px;
  // overflow: hidden;
  margin-top: 20px;
  &::-webkit-scrollbar {
    display: none;
  }
  ul {
    // position: absolute;
    overflow: hidden;
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
      margin: 22px 20px;
      vertical-align: bottom;
      i {
        font-size: 38px;
        color: #fff;
        opacity: 0.1;
        margin-top: -10px;
      }
      span {
        &.place {
          display: -webkit-box;
          width: 150px;
          height: 66px;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          color: #fff;
          font-size: 22px;
        }
        &.num {
          margin-top: 15px;
          color: #09ffff;
          font-size: 28px;
        }
        &.source {
          display: -webkit-box;
          margin-top: 33px;
          width: 110px;
          height: 20px;
          // margin-right: -17px;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          color: #fff;
          font-size: 8px;
          text-align: right;
          // transform: scale(0.7);
        }
      }
    }
  }
  .loading {
    background: transparent;
    text-align: center;
    color: #fff;
    display: block;
    width: 96%;
    margin-left: 10px;
    height: 22px;
  }
}
#drag {
  position: absolute;
  display: inline-block;
  width: 4px;
  height: 550px;
  box-sizing: content-box;
  top: 126px;
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
  margin: 0px 0 0 10px;
}
.divide {
  width: 97.4%;
  overflow: hidden;
}
</style>

