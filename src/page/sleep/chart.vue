<!--
 * @Author: your name
 * @Date: 2022-02-21 14:00:32
 * @LastEditTime: 2022-06-23 16:04:38
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \philips-air-conditioner\src\page\components\__index.vue
-->
<template>
  <div class="bl-chart">
    <div id="chart"></div>
  </div>
</template>
<script>
import * as echarts from 'echarts';
import { mapState } from 'vuex';
import config from 'configPath';
import arrowL from 'stylesPath/images/arrowL.svg';
import arrowR from 'stylesPath/images/arrowR.svg';
import { centigradeToFahrenheit } from 'utilsPath';
import variables from 'stylesPath/style/export-variables.less';

const { themeColor, axisColor } = variables;
const { tempRange } = config;
export default {
  name: 'Chart',
  components: {},
  props: {
    set: {
      type: Function,
      default: () => {},
    },
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      chart: null,
      arrowL,
      arrowR,
    };
  },
  computed: {
    ...mapState('app', ['appSettings']),
    setOptions() {
      console.log('-------setOptions--------', this.data);
      const { setTooltip, setXAxis, setYAxis, setSeries, setGrid } = this;
      const options = {
        tooltip: setTooltip(),
        xAxis: setXAxis(),
        yAxis: setYAxis(),
        series: setSeries(),
        grid: setGrid(),
      };
      return options;
    },
  },
  watch: {
    data(newVal, oldVal) {
      console.log('-----watch------', newVal, oldVal);
      const { setOptions } = this;
      this.chart.setOption(setOptions);
      this.hideTooltip();
    },
  },
  created() {},
  mounted() {
    this.initChart();
    window.set = (...args) => {
      this.hideTooltip();
      this.set(...args);
    };
  },
  methods: {
    initChart() {
      // 初始化图表
      const { setOptions } = this;
      this.chart = echarts.init(document.getElementById('chart'));
      this.chart.setOption(setOptions);
      this.chart.on('click', params => {
        // 用于做每个点的监听，只用点击点才能够获取想要的监听效果；
        const { dataIndex } = params;
        this.chart.dispatchAction({
          type: 'highlight',
          dataIndex,
        });
      });
      this.chart.getZr().on('click', event => {
        // 没有 target 意味着鼠标/指针不在任何一个图形元素上，它是从“空白处”触发的。
        // hack 点击空白处隐藏tooltip
        if (!event.target) {
          this.hideTooltip();
        }
      });
    },
    hideTooltip() {
      // 隐藏tooltip
      const { chart } = this;
      chart.dispatchAction({
        type: 'hideTip',
      });
      chart.dispatchAction({
        type: 'downplay',
      });
      // echarts hack 解决点击tooltip后，tooltip不隐藏问题
      chart._dom.childNodes[1].style.display = 'none';
    },
    setTooltip() {
      // 设置提示窗
      const { data } = this;
      const { tempUnit = 'C' } = this.appSettings;
      let tooltipPosition;
      const tooltip = {
        renderMode: 'html',
        className: 'tooltip',
        padding: [0, 0],
        backgroundColor: `${themeColor}`,
        borderWidth: 0,
        confine: true,
        enterable: true,
        extraCssText: 'z-index: 99;',
        position(point, params, dom, rect, size) {
          let position = 'top';
          const [pointX, pointY] = point;
          const [contentWidth, contentHeight] = size.contentSize;
          if (pointY < contentHeight) {
            position = 'bottom';
          }
          tooltipPosition = position;
          return position;
        },
        formatter(params, ticket, callback) {
          console.log('-----params-----', params);
          const current =
            data.filter(v => v.time === parseInt(params.name))[0] || {};
          const point = JSON.stringify(current);
          const tempText =
            tempUnit === 'C'
              ? `${current.temp}℃`
              : `${centigradeToFahrenheit(current.temp)}℉`; // 温度
          const ac_markText = current.text; // 档位
          const style = 'color: #fff';
          const iconStyle = 'width:10px;height:10px;';
          const textStyle = 'display:inline-block;width:50px;text-align:center';
          const triangleBaseStyle =
            'position:absolute; width: 0;height: 0;border-top: 10px solid transparent;border-bottom: 10px solid transparent;border-left: 10px solid transparent;border-right: 10px solid transparent;';
          const triangles = {
            top:
              'left:50%;bottom:-17px;margin-left:-10px;border-top: 10px solid #14726C;',
            bottom:
              'left:50%;top:-17px;margin-left:-10px;border-bottom: 10px solid #14726C;',
          };

          // 温度
          const temp = `
           <div style='${style}'>
            <span style='pointer-events:all;padding:10px 5px 0 13px;display: inline-block;' onClick='set("temp","sub",${point})'><img style='${iconStyle}' src='${arrowL}' /></span>
            <span style='${textStyle}'>${tempText}</span>
             <span style='pointer-events: all;padding:10px 13px 0 5px;display: inline-block;' onClick='set("temp","add",${point})'><img style='${iconStyle}' src='${arrowR}'/></span>
           </div>`;

          // 档位
          const ac_mark = `
            <div style='${style}'>
               <span style='pointer-events: all;padding:0px 5px 10px 13px;display: inline-block;' onClick='set("ac_mark","sub",${point})'><img style='${iconStyle}' src='${arrowL}' /></span>
               <span style='${textStyle}'>${ac_markText}</span>
               <span style='pointer-events: all;padding:0px 13px 10px 5px;display: inline-block;' onClick='set("ac_mark","add",${point})'><img style='${iconStyle}' src='${arrowR}'/></span>
            </div>`;

          // DOM
          let html = `
              <div>
               ${temp}
               ${ac_mark}
            </div>
            `;
          setTimeout(() => {
            const triangleStyle = `${triangleBaseStyle}${triangles[tooltipPosition]}`;
            const triangle = `
            <div class='triangle' style='${triangleStyle}'>
             </div>`;
            // 提示
            html = `
              <div>
               ${temp}
               ${ac_mark}
               ${triangle}
            </div>
            `;
            callback(ticket, html);
          }, 0);

          return html;
        },
      };
      return tooltip;
    },
    setGrid() {
      // 设置图表与div空白
      const grid = {
        top: 10,
        bottom: 30,
        right: 10,
        left: 38,
      };
      return grid;
    },
    setXAxis() {
      // 设置横坐标轴
      const { data } = this;
      const xData = data.map(v => (v.time > 9 ? v.time : `0${v.time}`));
      const xAxis = {
        data: xData,
        axisLabel: {
          color: axisColor,
          fontSize: 10,
        },
        axisLine: {
          symbol: ['circle', 'circle'],
          symbolSize: 5,
          lineStyle: {
            color: axisColor,
          },
        },
        axisTick: {
          show: false,
        },
      };
      return xAxis;
    },
    setYAxis() {
      // 设置纵坐标
      const { min, max } = tempRange;
      const { data } = this;

      const { tempUnit = 'C' } = this.appSettings;
      const yAxis = {
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          showMinLabel: true,
          showMaxLabel: true,
          color: axisColor,
          fontSize: 13,
          padding: [0, 23, 0, 0],
          formatter(value) {
            const seriesData = data.map(v => v.temp);
            if (seriesData.includes(value)) {
              return `${value}℃`;
            }
            return null;
          },
          align: 'center',
        },
        min,
        max,
        interval: 1,
      };
      if (tempUnit !== 'C') {
        yAxis.axisLabel = {
          ...yAxis.axisLabel,
          formatter(value) {
            const seriesData = data.map(v => centigradeToFahrenheit(v.temp));
            if (seriesData.includes(value)) {
              return `${value}℉`;
            }
            return null;
          },
        };
        yAxis.min = centigradeToFahrenheit(min);
        yAxis.max = centigradeToFahrenheit(max);
        yAxis.interval = 1.8;
      }
      return yAxis;
    },
    setSeries() {
      // 设置折线数据
      const { data } = this;
      const { tempUnit = 'C' } = this.appSettings;
      const seriesData = data.map(v => {
        if (tempUnit === 'C') {
          return v.temp;
        }
        return centigradeToFahrenheit(v.temp);
      });
      console.log('-----setSeries------', seriesData);
      const series = [
        {
          name: '',
          type: 'line',
          symbol: 'circle',
          symbolSize: 8,
          data: seriesData,
          lineStyle: {
            color: themeColor,
            width: 2,
          },
          itemStyle: {
            borderWidth: 15,
            borderColor: 'transparent',
            color: themeColor,
          },
          emphasis: {
            // 鼠标hover上去的时候，拐点的颜色和样式
            itemStyle: {
              borderWidth: 5,
              color: themeColor, // 颜色
              borderColor: themeColor, // 图形的描边颜色
            },
          },
        },
      ];
      return series;
    },
  },
};
</script>

<style lang="less" scoped>
#chart {
  padding: 0 0 0 20px;
  width: 100%;
  height: 600px;
  background: @bl-white;
}
</style>
