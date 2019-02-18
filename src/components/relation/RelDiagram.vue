<template>
  <div id="echart" class="echarts">
    <div style="text-align: left">
    <a class="button is-rounded is-outlined is-small" @click="saveAsPNG">
      Save as PNG
    </a>
    <a class="button is-rounded is-outlined is-small" @click="saveToCSV">
      Export to CSV
    </a>
    </div>
    <IEcharts :initOpts="initOpt" :option="diagram" :resizable="resize" @click="onClick" @ready="onReady" :loading="loading"></IEcharts>
  </div>
</template>

<script>
  import IEcharts from 'vue-echarts-v3/src/lite.js';
  export default {
    name: 'RelDiagram',
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
      diagram: {
        title: {
          text: ''
        },
        tooltip: {
        },
        series: [{
          type: 'graph',
          layout: 'force',
          animation: true,
          roam: true,
          draggable: true,
          hoverAnimation: true,
          data: [],
          symbolSize: 18,
          label: {
            show: true,
            position: 'right',
            color: '#c62828',
            fontWeight: 'bold',
            fontSize: 13,
            formatter: function (params) {
                return params.data.name;
              }
          },
          focusNodeAdjacency: true,
          force: {
            repulsion: 500,
            edgeLength: 100,
            gravity: 0.1
          },
          edges: [],
          lineStyle: {
            width: 3
          },
          tooltip: {
            formatter: function (params, ticket, callback) {
              if (params.dataType === 'node')
                return params.data.name;
              else {
                return 'P-Value: ' + params.data.value;
              }
            }
          }
        }]
      }
    }),
    watch: {
      datas: function(cur, old) {
        this.refreshData();
      },
    },
    mounted: function () {
      this.refreshData();
    },
    methods: {
      onClick: function (event, instance, echarts) {
        if (event.dataType === 'node')
          this.$router.replace('/disease/' + event.data.name);
      },
      onReady(instance) {
        this.instance = instance;
      },
      refreshData: function() {
        this.loading = true;
        let nodes = new Set();
        let edges = [];
        nodes.add(this.name);
        for (let data of this.datas) {
          nodes.add(data.d);
          edges.push({
            source: this.name,
            target: data.d,
            value: data.p
          });
        }
        this.diagram.series[0].data = [...nodes].map(n => ({name: n}));
        this.diagram.series[0].edges = edges;
        this.loading = false;
      },
      saveToCSV: function () {
        let data = this.datas.map(obj => ({
            d: obj.d,
            g: obj.g.join(' '),
            p: obj.p
          }));
        let value = ['d', 'g', 'p'];
        let label = ['disease', 'shared genes', 'p-value'];
        let field = [];
        for (let i = 0; i < 3; i++)
          field.push({
            value: value[i], label: label[i]
          });
        this.exportToCSV(data, field, 
          this.name + "_related_disease");
      },
      saveAsSVG: function () {
        let echart = document.getElementById('echart');
        let svg = echart.getElementsByTagName("svg")[0];
        this.exportAsSVG(svg, this.name + "_related_disease");
      },
      saveAsPNG: function () {
        const url = this.instance.getDataURL({
            pixelRatio: 2,
            backgroundColor: '#fff'
        });
        this.download(url, this.name + '_related_disease.png');
      }
    }
  }
</script>

<style scoped>
  .echarts {
    width: 100%;
  }
</style>
