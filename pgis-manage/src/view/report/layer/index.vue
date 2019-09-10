<template>
  <div>
    <!-- 专用 -->
    <!-- 图格展示 -->
    <!-- <div class="gridShow" v-show="curOperate===1">
      <ul class="clearfix content">
        <li v-for="item in data3" :key="item">
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
    <!-- 滚动条 -->
    <!-- <div id="drag" v-show="curOperate===1&&scrollStatus===true">
      <div class="bar"></div>
    </div>-->
    <!-- 列表展示 -->
    <div class="tableBox tb tb1">
      <Table
        :disabled-hover="false"
        :row-class-name="rowClassName"
        :columns="columns"
        :data="data"
        width="1114"
      ></Table>
      <div class="divide"><Page :total="total" :current="curPage" simple @on-change="changePage" /><span class="fr totalNum">共<strong>{{total}}</strong>条</span></div>
    </div>
    <!-- :height="data1Height" -->
  </div>
</template>
<script>
import "./layer.less";
export default {
  props: ["columns", "data", "responseTotal", "changePage", "curPage"],
  data() {
    return {
      data1Height: ""
    };
  },
  computed: {
    total() {
      return Number(this.responseTotal);
    },
    page(){
      return this.curPage
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
    },
    getBoxHeight() {
      // return 200
      let offsetHeight = document.querySelector(".tb1");
      //   console.log(offsetHeight);
      if (offsetHeight <= 280) {
        return offsetHeight;
      } else {
        return 280;
      }
    }
  },
  mounted() {
    this.data1Height = this.getBoxHeight();
    //计算分页input的宽度
    var divideInput = document.getElementsByClassName("ivu-page-simple-pager")[0].children[0];
    var beishu = ((this.total/10)+"").length;
    divideInput.style.width = (30+(3*beishu)) + "px";
  }
};
</script>
<style lang="less" scoped>
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
          color: #fff;
          font-size: 22px;
        }
        &.num {
          margin-top: 30px;
          color: #09ffff;
          font-size: 28px;
        }
        &.source {
          margin-top: 48px;

          color: #fff;
          font-size: 8px;
          transform: scale(0.7);
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
  margin: 20px 0 0 10px;
}
.divide{
  width: 97.4%;
  overflow: hidden;
}
.totalNum{
  display:inline-block;
  line-height: 43px;
  padding-right:10px;
  color:#fff;
  strong{
    padding:6px;
  }
}
</style>

