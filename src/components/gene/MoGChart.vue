<template>
  <div id="echart" class="chart">
    <div style="text-align: left; margin-bottom: 10px">
    <a class="button is-rounded is-outlined is-small" @click="saveAsPNG">
      Save as PNG
    </a>
    <a class="button is-rounded is-outlined is-small" @click="saveToCSV">
      Export to CSV
    </a>
    </div>
    <IEcharts :initOpts="initOpt" :option="options" :resizable="resize" @click="onClick" :loading="loading" @ready="onReady"></IEcharts>
  </div>
</template>

<script>
  import IEcharts from 'vue-echarts-v3/src/lite.js';
  import 'echarts/lib/chart/scatter';
  import 'echarts/lib/component/legend';
  import 'echarts/lib/component/tooltip';
  import 'echarts/lib/component/dataZoom';
  import 'echarts/lib/component/grid';
  export default {
    name: "MoGChart",
    components: {
      IEcharts
    },
    props: ['datas', 'gene'],
    data: () => ({
      instance: null,
      loading: true,
      resize: true,
      notMerge: true,
      initOpt: {
        // renderer: 'svg'
      },
      options: {
        tooltip: {
          confine: true,
          formatter: function (params) {
              return ["disease: " + params.data.name,
                      "chr: " + params.data.meta.chr,
                      "mutation: " + (params.data.meta.ref || '-')
                                   + ' > '
                                   + (params.data.meta.ale || '-'),
                      "variation: " + params.data.meta.var,
                      "position: " + params.data.meta.pos]
                      .join('<br>');
          }
        },
        legend: {
          data: [],
          itemGap: 20,
          textStyle: {
            fontSize: 12
          }
        },
        grid: {
          show: false,
          left: '2%',
          right: '2%',
          height: 40
        },
        dataZoom: [{
            type: 'slider',
            start: 0,
            end: 100
        }, {
            type: 'inside',
            start: 0,
            end: 100
        }],
        xAxis: {
            scale: true,
            splitLine: {
              show: false
            },
            axisTick: {
              show:false
            },
            axisLine: {
              lineStyle: {
                color: "#aaa"
              }
            }
        },
        yAxis: {
          max: 4,
          show: false
        },
        series: []
      }
    }),
    watch: {
      datas: function(cur, old) {
        this.refreshData();
      }
    },
    methods: {
      onReady: function (instance, echarts) {
        this.instance = instance;
        this.refreshData();
      },
      onClick: function (event, instance, echarts) {
        this.$router.replace('/disease/' + event.data.name);
      },
      refreshData: function() {
        if (!this.datas) return;
        this.loading = true;
        let category = {};
        let categoryData = [];
        let series = [];
        // this.options.xAxis.min = this.gene.b;
        // this.options.xAxis.max = this.gene.e;
        let i = 0;
        for (let data of this.datas) {
          let disease = data['pt'];
          if (data['pos'] === undefined) continue;
          let pos = data['pos'].split('_');
          let begin = parseInt(pos[0]);
          let end = pos.length === 2 ? parseInt(pos[1]) : begin;
          if (category[disease] === undefined) {
            category[disease] = i;
            categoryData.push(disease);
            series.push({
                name: disease,
                type: 'scatter',
                label: {
                  // show: true,
                  position: 'inside',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: 13,
                  formatter: function (params) {
                          let names = params.data.name.split('_');
                          let name = names.map((n) => (n[0])).join('');
                          return name.toUpperCase();
                        }
                },
                symbolSize: function (val) {
                  return val[2];
                },
                itemStyle: {
                  opacity: 0.8
                },
                data: []
            });
            i = i + 1;
          }
          series[category[disease]].data.push({
            name: disease,
            meta: {
              chr: data['chr'],
              ref: data['ref'],
              ale: data['ale'],
              var: data['var'],
              pos: begin + '->' + end
            },
            value: [
              Math.round((end+begin)/2),
              1.5+category[disease]/1.5,
              25
            ]
          });
        };
        this.options.legend.data = categoryData;
        this.options.series = series;
        this.$emit('onNumDiss', series.length);
        this.loading = false;
        if (this.instance)
          this.instance.setOption(this.options, true);
      },
      saveAsSVG: function () {
        let echart = document.getElementById('echart');
        let svg = echart.getElementsByTagName("svg")[0];
        this.exportAsSVG(svg, this.gene.g + "_related_muts");
      },
      saveToCSV: function () {
        let data = this.options.legend.data.map(d => ({
            disease: d
          }));
        let field = ['disease'];
        this.exportToCSV(data, field, 
          this.gene.g + "_related_disease");
      },
      saveAsPNG: function () {
        const url = this.instance.getDataURL({
            pixelRatio: 2,
            backgroundColor: '#fff'
        });
        this.download(url, this.gene.g + '_related_disease.png');
      }
    }
  }
</script>

<style scoped>
  .chart {
    width: 100%;
    height: 220px;
    padding-bottom: 40px;
  }
</style>
