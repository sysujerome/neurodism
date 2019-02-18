<template>
  <div class="gocchart">
    <div style="text-align: left">
    <a class="button is-rounded is-outlined is-small" @click="saveAsPNG">
      Save as PNG
    </a>
    <a class="button is-rounded is-outlined is-small" @click="saveToCSV">
      Export to CSV
    </a>
    </div>
    <IEcharts id="echart" :initOpts="initOpt" :option="options" :resizable="resize" @ready="onReady" @click="onClick" :loading="loading"></IEcharts>
  </div>
  </div>
</template>

<script>
  import IEcharts from 'vue-echarts-v3/src/lite.js';
  import 'echarts/lib/chart/bar';
  import 'echarts/lib/chart/custom';
  import 'echarts/lib/component/legend';
  import 'echarts/lib/component/tooltip';
  import 'echarts/lib/component/dataZoom';
  import 'zrender/lib/svg/svg';
  export default {
    name: "GoCChart",
    components: {
      IEcharts
    },
    props: ['name', 'datas'],
    data: () => ({
      instance: null,
      loading: true,
      resize: true,
      initOpt: {
        // renderer: 'svg'
      },
      chrs: null,
      options: {
        grid: {
          show: false,
          left: '2%',
          right: '2%',
          top: 30
        },
        dataZoom: [{
            type: 'slider',
            xAxisIndex: [0],
            filterMode: 'filter',
            start: 0,
            end: 100
        }, {
            type: 'inside',
            xAxisIndex: [0],
            filterMode: 'filter',
            start: 50,
            end: 70
        }],
        tooltip: {
          formatter: function (params, ticket, callback) {
            return "gene: " + params.data.gene;
          }
        },
        xAxis: {
          show: false,
          data: []
        },
        yAxis: {
          show: false
        },
        series: [{
            type: 'bar',
            name: 'chr',
            silent: true,
            label: {
              show: true,
              position: 'bottom',
              color: '#666',
              // fontSize: 10,
              formatter: function (params) {
                return params.data.name.slice(4);
            }
            },
            data: [],
            itemStyle: {
                normal: {
                    color: '#ECEFF1'
                }
            }
        }, {
            type: 'custom',
            name: 'mutation',
            itemStyle: {
                normal: {
                    borderWidth: 4
                }
            },
            label: {
              show: true,
              position: 'top',
              distance: 2,
              color: '#c62828',
              fontWeight: 'bold',
              fontSize: 15,
              formatter: function (params) {
                return params.data.gene
              }
            },
            renderItem: null,
            encode: {
                x: 0,
                y: [1, 2]
            },
            data: [],
            z: 5
        }]
      }
    }),
    watch: {
      datas: function(cur, old) {
        this.refreshData();
      }
    },
    created: function() {
      this.options.series[1].renderItem = this.renderItem;
      const that = this;
      this.$http.get('/api/chr/all').then(res => {
        that.chrs = res.data;
        that.refreshData();
      });
    },
    methods: {
      onClick: function (event, instance, echarts) {
        this.$router.replace('/gene/' + event.data.gene);
      },
      refreshData: function() {
        this.loading = true;
        // let browser = navigator.userAgent;
        // if (browser.indexOf('Safari') !== -1 && browser.indexOf('Mac') !== -1) {
        //   // alert(browser);
        //   this.options.series[1].label.distance = 12;
        // }
        let categoryData = new Array(23);
        let barData = new Array(23);
        function getIdx(chr) {
          let idx = 22;
          if (chr !== 'X') idx = parseInt(chr)-1;
          return idx;
        }
        for (let chr in this.chrs) {
          let idx = getIdx(chr);
          categoryData[idx] = "chr " + chr;
          barData[idx] = {
            name: categoryData[idx],
            value: parseInt(this.chrs[chr]['chr_end']),
            itemStyle: {
              color: idx & 1 ? '#ECEFF1' : '#F7F9F9'
            }
          };
        }
        let genes = [];
        let isExist = new Array();
        for (let data of this.datas) {
          if (isExist[data['gene']]) continue;
          if (data['pos'] === undefined) continue;
          let pos = data['pos'].split('_');
          let begin = parseInt(pos[0]);
          let end = pos.length === 2 ? parseInt(pos[1]) : begin;
          genes.push({
            gene: data['gene'],
            value: [
              getIdx(data['chr']),
              begin,
              end
            ]});
          isExist[data['gene']] = true;
        }

        this.options.xAxis.data = categoryData;
        this.options.series[0].data = barData;
        this.options.series[1].data = genes;
        this.loading = false;
      },
      onReady(instance) {
        this.instance = instance;
      },
      renderItem: function(params, api) {
        var xValue = api.value(0);
        var highPoint = api.coord([xValue, api.value(1)]);
        var lowPoint = api.coord([xValue, api.value(2)]);
        var halfWidth = api.size([1, 0])[0] * 0.3;
        var style = api.style({
            stroke: api.visual('color'),
            fill: null
        });

        return {
            type: 'line',
            shape: {
                    x1: highPoint[0] - halfWidth, y1: highPoint[1],
                    x2: highPoint[0] + halfWidth, y2: highPoint[1]
                },
            style: style
        };
      },
      saveAsSVG: function () {
        let echart = document.getElementById('echart');
        let svg = echart.getElementsByTagName("svg")[0];
        this.exportAsSVG(svg, this.name + "_related_gene");
      },
      saveToCSV: function () {
        let data = this.options.series[1].data.map(obj => ({
            gene: obj.gene,
            chr: this.options.xAxis.data[obj.value[0]].slice(4),
            begin: obj.value[1],
            end: obj.value[2]
          }));
        let field = ['gene', 'chr', 'begin', 'end'];
        this.exportToCSV(data, field, 
          this.name + "_related_gene");
      },
      saveAsPNG: function () {
        const url = this.instance.getDataURL({
            pixelRatio: 2,
            backgroundColor: '#fff'
        });
        this.download(url, this.name + '_related_gene.png');
      }
    }
  }
</script>

<style scoped>
  .gocchart {
    width: 100%;
    height: 600px;
    max-height: 600px;
    padding-bottom: 40px;
  }
</style>
