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
  import 'zrender/lib/svg/svg';
  import 'echarts/lib/component/grid';
  export default {
    name: 'GeneRelDiagram',
    components: {
      IEcharts
    },
    props: ['name'],
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
          draggable: true,
          symbolSize: 18,
          hoverAnimation: true,
          focusNodeAdjacency: true,
          data: [],
          label: {
            show: true,
            fontWeight: 'bold',
            // color: '#1E88E5',
            fontSize: 14,
            position: 'right'
          },  
          itemStyle: {
            // color: '#1E88E5'
          },           
          lineStyle: {
            width: 3,
            color: '#888'
          },
          force: {
            // initLayout: 'circular',
            repulsion: 0,
            edgeLength: 0
          },
          edges: [],
          tooltip: {
            formatter: function (params, ticket, callback) {
              if (params.dataType === 'node')
                return params.name;
              else {
                return 'shared diseases: ' + params.value;
              }
            }
          }
        }]
      }
    }),
    watch: {
      name: function(cur, old) {
        this.refreshData();
      }
    },
    mounted: function () {
    },
    created: function () {
      this.refreshData();
    },
    methods: {
      onClick: function (event, instance, echarts) {
        if (event.dataType === 'node') {
          this.$router.replace('/gene/' + event.data.name);
        }
        else { // edge
          this.$router.push(
            '/relation/gene/' +
            event.data.source + '/' + event.data.target
          );
        }
      },
      onReady(instance) {
        this.instance = instance;
      },
      refreshData: function() {
        const that = this;
        // this.loading = true;
        this.$http.get('/api/gp/' + this.name).then(res => {
          let datas = res.data;
          let _index = {};
          let nodes = new Set();
          let edges = [];
          for (let data of datas) {
            let g1 = data["g1"];
            let g2 = data["g2"];
            let d = data["d"];
            nodes.add(g1);
            nodes.add(g2);
            edges.push({
              source: g1,
              target: g2,
              value: d
            });
          }
          // nodes.map((d) => { d.value = d.name; });

          that.diagram.series[0].data = [...nodes].map(n => ({name: n}));
          that.$emit('onNumGenes', that.diagram.series[0].data.length);
          that.diagram.series[0].edges = edges;
          that.diagram.series[0].force = {
              repulsion: that.name === 'all' ? 0 : 100,
              edgeLength: that.name === 'all' ? 350 : 150
          };
          that.loading = false;
        });
      },
      saveToCSV: function () {
        let data = this.diagram.series[0].edges.map(obj => ({
            g1: obj.source,
            g2: obj.target,
            d: obj.value.join(' ')
          }));
        let value = ['g1', 'g2', 'd'];
        let label = ['gene 1', 'gene 2', 'shared genes'];
        let field = [];
        for (let i = 0; i < 3; i++)
          field.push({
            value: value[i], label: label[i]
          });
        this.exportToCSV(data, field, 
          this.name + "_related_gene");
      },
      saveAsSVG: function () {
        let echart = document.getElementById('diagram');
        let svg = echart.getElementsByTagName("svg")[0];
        this.exportAsSVG(svg, 
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
  .echarts {
    width: 100%;
  }

</style>
