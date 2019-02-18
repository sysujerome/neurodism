<template>
  <div class="container card">
    <div class="card-header">
      <p class="card-header-title is-centered">Gene {{name}}</p>
    </div>
    <div class="card-content" v-show="datas.length === 0" >
      Oops! This gene is not in our database.
    </div>
    <b-tabs class="b-tabs" v-show="datas.length > 0" expanded size="is-small" v-model="active">
      <b-tab-item :label="'Related Diseases: ' + numDiss">
        <MoGChart :datas="datas" :gene="gene" @onNumDiss="setNumDiss"/>
      </b-tab-item>
      <b-tab-item :label="'Related Genes: ' + numGenes">
        <GeneRelDiagram style="height: 500px" :name="name" @onNumGenes="setNumGenes"></GeneRelDiagram>
      </b-tab-item>
      <b-tab-item :label="'Related Mutations: ' + datas.length">
        <Table :name="name" :datas="datas"></Table>
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
  import MoGChart from './MoGChart'
  import GeneRelDiagram from './GeneRelDiagram'
  import Table from '../Table'
  export default {
    name: "Gene",
    components: {
      MoGChart, GeneRelDiagram, Table
    },
    data: () => ({
      name: 'gene',
      datas: [],
      gene: null,
      active: 0,
      numGenes: 0,
      numDiss: 0,
      loading: true
    }),
    computed: {
      tabset: function() {
        return [{label: 'Related Diseases: ' + this.numDiss, name: "d"},
                {label: 'Related Genes: ' + this.numGenes, name: "g"},
                {label: 'Related Mutations: ' + this.datas.length, name: "m"}];
      }
    },
    watch: {
      $route: function(cur, old) {
        this.refreshData();
      }
    },
    created: function () {
      this.refreshData();
    },
    methods: {
      refreshData: function() {
        this.loading = true;
        this.name = this.$route.params.name;
        const that = this;
        that.datas = [{}];
        this.$http.get('/api/gene/' + this.name).then(res => {
          that.datas = res.data.muts;
          that.loading = false;
          that.gene = res.data.gene;
        });
      },
      setNumDiss: function(value) {
        this.numDiss = value;
      },
      setNumGenes: function(value) {
        this.numGenes = value;
      }
    }
  }
</script>

<style scoped>
.tabs-gene {
  text-align: center;
}

.b-tabs {
  margin-top: 10px;
}
</style>
