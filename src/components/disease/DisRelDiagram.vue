<template>
  <div id="diagram" class="echarts">
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
  import 'echarts/lib/chart/graph';
  import 'echarts/lib/component/legend';
  import 'echarts/lib/component/tooltip';
  import 'echarts/lib/component/title';
  import 'zrender/lib/svg/svg';
  export default {
    name: 'DisRelDiagram',
    components: {
      IEcharts
    },
    props: ['name', 'filters'],
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
            fontSize: 14,
            formatter: function (params) {
                return params.data.name;
              }
          },
          focusNodeAdjacency: true,
          force: {
            // initLayout: 'circular',
            repulsion: 50,
            edgeLength: 40,
            gravity: 0.1
          },
          edges: [],
          // lineStyle: {
          //   width: 3
          // },
          tooltip: {
            formatter: function (params, ticket, callback) {
              if (params.dataType === 'node')
                return params.name;
              else {
                let out = [];
                if (params.data.v.g !== null) {
                  out.push("gene p-value: " + params.data.v.g +
                   (params.data.v.g < 0.05 ? ' remarkable' : ' '));
                }
                if (params.data.v.m !== null) {
                  out.push("mutation p-value: " + params.data.v.m +
                   (params.data.v.m < 0.05 ? ' remarkable' : ' '));
                }
                if (params.data.v.p !== null) {
                  out.push("path p-value: " + params.data.v.p +
                   (params.data.v.p < 0.05 ? ' remarkable' : ' '));
                }
                if (params.data.g.length > 0) {
                  out.push('shared genes: ' + params.data.g);
                }
                if (params.data.m.length > 0) {
                  out.push('shared mutations: ' + params.data.m.length);
                }
                return out.join("<br>");
              }
            }
          }
        }]
      }
    }),
    watch: {
      name: function(cur, old) {
        this.refreshData();
      },
      filters: function(cur, old) {
        this.refreshData();
      }
    },
    created: function () {
      this.refreshData();
    },
    methods: {
      onClick: function (event, instance, echarts) {
        if (event.dataType === 'node') {
          if (this.name === 'all')
            this.$router.push('/disease/' + event.data.name);
          else this.$router.replace('/disease/' + event.data.name);
        }
        else { // edge
          this.$router.push(
            '/relation/disease/' +
            event.data.source + '/' + event.data.target
          );
        }
      },
      onReady(instance) {
        this.instance = instance;
      },
      refreshData: function() {
        const that = this;
        this.$http.get('/api/dp/' + this.name).then(res => {
          let datas = res.data;
          let _index = {};
          let i = 1;
          let lineColors = ['#666', '#666', '#666'];
          let isExist = new Array();
          let nodes = new Set();
          let edges = [];
          if (this.name !== 'all')
            nodes.add(this.name);
          for (let data of datas) {
            let d1 = data["d1"];
            let d2 = data["d2"];
            let sig = data["s"];
            if (that.filters && that.filters.length > 0) {
              let gs = [];
              for (let g of data['g']) {
                if (that.filters.indexOf(g) > -1)
                  gs.push(g);
              }
              if (gs.length === 0) continue;
              data['g'] = gs;
              data['m'] = [];
            }
            nodes.add(d1);
            nodes.add(d2);
            edges.push({
              source: d1,
              target: d2,
              value: sig,
              v: data['v'],
              g: data['g'],
              m: data['m'],
              lineStyle: {
                width: 1.5 + sig,
                color: lineColors[sig-1]
              }
            });
          }
          that.diagram.series[0].data = [...nodes].map(n => ({name: n}));
          that.diagram.series[0].edges = edges;
          that.diagram.series[0].force = {
              repulsion: that.name === 'all' ? 500 : 500,
              edgeLength: that.name === 'all' ? 350 : 100
          };
          that.loading = false;
          that.$emit('onNumDiss', nodes.size-1);
        });
      },
      saveToCSV: function () {
        let data = this.diagram.series[0].edges.map(obj => ({
            d1: obj.source,
            d2: obj.target,
            pg: obj.v.g,
            pm: obj.v.m,
            pp: obj.v.p,
            g: obj.g.join(' '),
            m: obj.m.join(' ')
          }));
        let value = ['d1', 'd2', 'pg', 'pm', 'pp', 'g', 'm'];
        let label = ['disease 1', 'disease 2', 'p-value gene', 'p-value mutation', 'p-value path', 'shared genes', 'shared mutations'];
        let field = [];
        for (let i = 0; i < 7; i++)
          field.push({
            value: value[i], label: label[i]
          });
        this.exportToCSV(data, field, 
          this.name + "_related_disease");
      },
      saveAsSVG: function () {
        let echart = document.getElementById('diagram');
        let svg = echart.getElementsByTagName("svg")[0];
        this.exportAsSVG(svg, 
          this.name + "_related_disease");
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
