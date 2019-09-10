<template>
  <div>
    <!--创建一个echarts的容器-->
    <div id="echartContainer" style="width:700px; height:322px"></div>
  </div>
</template>
<script>
export default {
  inject: ["reload"],
  //   data(){
  //   return {
  //     incrementList:[{month:[0],count:[0]}]
  //   }
  // },
  props: ["incrementList"],
  methods: {
    getMaxOfArray(numArray) {
      return Math.max.apply(null, numArray);
    },
    mathLog(x, z) {
      var logx = Math.log(x);
      var logz = Math.log(z);
      return logz / logx;
    }
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    console.log(this.incrementList);
    var date = this.incrementList.map(item => {
      return item.time;
    });
    var count = this.incrementList.map(item => {
      return item.count;
    });

    //计算最大值和间隔
    var maxCount = this.getMaxOfArray(count);
    var yushu = parseInt(this.mathLog(10, maxCount));
    var interval = Math.pow(10, yushu);
    var maxNum = (parseInt(maxCount / interval) + 1) * interval;
    console.log(maxCount, yushu, interval, maxNum);

    var myChart = this.$echarts.init(document.getElementById("echartContainer"))
    // var myChart = echarts.init(;

    // 绘制图表
    myChart.setOption({
      grid: {
        left: "3%",
        right: "10%",
        bottom: "8%",
        top: "10%",
        containLabel: true
      },
      xAxis: [
        {
          name: "月", // 给X轴加单位
          type: "category",
          boundaryGap: false,
          data: date, //拿到真实接口的2012-12在axisLabel函数中进行裁剪成12,在formatter的b0应该会显示2012-12
          // data:[0,1],
          axisLabel: {
            formatter: function(value, idx) {
              if (value.substring(5) < 10) {
                return value.substring(6);
              }
              return value.substring(5);
            }
          },
          axisLine: {
            lineStyle: {
              color: "#fff",
              width: 2 //这里是为了突出显示加上的
            }
          }
        }
      ],
      yAxis: [
        {
          name: "条", // 给y轴加单位
          type: "value",
          min: 0,
          max: maxNum,
          interval: parseInt(maxNum / 2),
          splitLine: {
            show: false //去掉网格线
          },
          axisLine: {
            lineStyle: {
              color: "#fff",
              width: 2 //这里是为了突出显示加上的
            }
          }
        }
      ],
      // axisPointer: { show: true, type: 'line', }, //这个关了就没有提示框了
      series: [
        {
          // symbol: "none",
          name: "邮件营销",
          type: "line",
          stack: "总量",
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(0,160,255,1)" // 0% 处的颜色
                },
                // {
                //   offset: 0.98,
                //   color: "#102C44" // 0% 处的颜色
                // },
                {
                  offset: 1,
                  color: "rgba(2,20,52,.65)" // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          },
          lineStyle: { color: "#A3F6F8" },
          data: count,
          // data:[100,1000],
          smooth: true,
          itemStyle: {
            normal: {
              lineStyle: {
                color: "#54c4f9"
              },
              borderColor: "#00ffff"
            }
          }
        }
      ],
      tooltip: {
        show: true,
        trigger: "axis",
        axisPointer: {
          type: "line",
          label: {
            backgroundColor: "#6a7985"
          }
        },
        formatter: "{b0}: {c0}" //提示框内容
      }
    });

    // async function show(){

    // }
    setInterval(() => {
      myChart.clear();
      myChart.setOption({
        grid: {
          left: "3%",
          right: "10%",
          bottom: "8%",
          top: "10%",
          containLabel: true
        },
        xAxis: [
          {
            name: "月", // 给X轴加单位
            type: "category",
            boundaryGap: false,
            data: date, //拿到真实接口的2012-12在axisLabel函数中进行裁剪成12,在formatter的b0应该会显示2012-12
            // data:[0,1],
            axisLabel: {
              formatter: function(value, idx) {
                if (value.substring(5) < 10) {
                  return value.substring(6);
                }
                return value.substring(5);
              }
            },
            axisLine: {
              lineStyle: {
                color: "#fff",
                width: 2 //这里是为了突出显示加上的
              }
            }
          }
        ],
        yAxis: [
          {
            name: "条", // 给y轴加单位
            type: "value",
            min: 0,
            max: maxNum,
            interval: parseInt(maxNum / 2),
            splitLine: {
              show: false //去掉网格线
            },
            axisLine: {
              lineStyle: {
                color: "#fff",
                width: 2 //这里是为了突出显示加上的
              }
            }
          }
        ],
        // axisPointer: { show: true, type: 'line', }, //这个关了就没有提示框了
        series: [
          {
            // symbol: "none",
            name: "邮件营销",
            type: "line",
            stack: "总量",
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(0,160,255,1)" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(2,20,52,.65)" // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            },
            lineStyle: { color: "#A3F6F8" },
            data: count,
            // data:[30000000,10000000,30000000,5000000,30000000,555555,2222222,12131310,30000000,30000000,30000000],
            smooth: true,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "#54c4f9"
                },
                borderColor: "#5fffff"
              }
            }
          }
        ],
        tooltip: {
          show: true,
          trigger: "axis",
          axisPointer: {
            type: "line",
            label: {
              backgroundColor: "#6a7985"
            }
          },
          formatter: "{b0}: {c0}" //提示框内容
        }
      });
    }, 10000);
  }
};
</script>
