<template>
  <div id='cy'>
    <b-loading :is-full-page="false" :active.sync="loading" :canCancel="true"></b-loading>
  </div>
</template>

<script>
  export default {
    name: "GeneRelDiagramCy",
    props: ['name'],
    data: () => ({
      loading: true
    }),
    mounted: function () {
      this.refreshData();
    },
    methods: {
      refreshData: function() {
        const that = this;
        this.loading = true;
        this.$http.get('/api/gp/' + this.name).then(res => {
          this.loading = false;
          let cytoscape = require('cytoscape');
          let euler = require('cytoscape-euler');
          cytoscape.use( euler );
          let eles = [];
          let isExist = {};
          for (let data of res.data) {
            let n1 = data['g1'];
            let n2 = data['g2'];
            let v = data['d'].length;
            if (!isExist[n1]) {
              isExist[n1] = true;
              eles.push({
                data: {
                  id: n1
                }
              });
            }
            if (!isExist[n2]) {
              isExist[n2] = true;
              eles.push({
                data: {
                  id: n2
                }
              });
            }
            eles.push({
              data: {
                id: n1 + n2,
                value: v,
                source: n1,
                target: n2
              }
            })
          }
          let cy = cytoscape({
            container: document.getElementById('cy'),
            elements: eles,
            style: [
              {
                selector: 'node',
                style: {
                  'background-color': '#c62828',
                  'width': 12,
                  'font-size': 10,
                  'height': 12,
                  "color": '#888',
                  'content': 'data(id)'
                }
              }, // node style
              {
                selector: 'edge',
                style: {
                  'width': 1,
                  'line-color': '#444',
                }
              } // edge style
            ], // style
            layout: {
              name: 'euler',
              springLength: edge => 100,
              animate: true,
              refresh: 10,
              gravity: -10,
              springCoeff: edge => 0.0002,
              randomize: true,
              fit: false,
            },
            zoom: 1,
            minZoom: 0.2,
            maxZoom: 4
          });
          const that = this;
          cy.nodes().on("click", function() {
            if (that.name === 'all')
              that.$router.push('/gene/' + this.id());
            else that.$router.replace('/gene/' + this.id());
          });
        });
      }
    }
  }
</script>

<style scoped>

#cy {
  display: block;
  height: 700px;
  width: 100%;
}

</style>
