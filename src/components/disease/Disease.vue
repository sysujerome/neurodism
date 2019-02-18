 <template>
  <div class="container card">
    <div class="card-header">
      <p class="card-header-title is-centered">
        Disease {{name}}</p>
    </div>
    <div v-show="genes.length > 0" style="margin-top: 10px; text-align: center">Gene Filter:
      <a class="button is-outlined is-success is-small" v-for="g in genes" :key="g"  @click="handleClick(g)">{{g}}</a>
      <a class="button is-outlined is-rounded is-small" @click="emitTags">
          <b-icon pack="fa" type="is-grey" icon="edit" size="is-small">
          </b-icon>
      </a>
    </div>
    <div class="card-content" v-show="originDatas.length === 0" >
       Oops! This disease is not in our database.
    </div>
    <b-tabs class="b-tabs" expanded v-show="originDatas.length > 0" size="is-small" v-model="active">
      <b-tab-item :label="'Related Genes: ' + numGenes">
        <GoCChart :name="name" :datas="datas"/>
      </b-tab-item>
      <b-tab-item :label="'Related Diseases: ' + numDiss">
        <DisRelDiagram style="height: 500px" :name="name" :filters="genes" @onNumDiss="setNumDiss"></DisRelDiagram>
      </b-tab-item>
      <b-tab-item :label="'Related Mutations: ' + datas.length">
        <Table :name="name" :datas="datas"></Table>
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
  import GoCChart from './GoCChart'
  import DisRelDiagram from './DisRelDiagram'
  import Table from '../Table'
  export default {
    name: "Disease",
    components: {
      GoCChart, DisRelDiagram, Table
    },
    data: () => ({
      name: 'disease',
      active: 0,
      datas: [],
      originDatas: [],
      disease: { m: 0, g: [] },
      genes: [],
      numGenes: 0,
      numDiss: 0,
      loading: true
    }),
    watch: {
      $route: function(cur, old) {
        if (cur.path === old.path) {
          this.filterData();
        } else this.refreshData();
      }
    },
    created: function () {
      this.refreshData();
    },
    methods: {
      filterData: function() {
        this.getGenes();
        const that = this;
        if (that.genes.length > 0) {
          that.numGenes = 0;
          for (let g of that.genes)
            if (that.disease.g.indexOf(g) > -1)
              ++that.numGenes;
          that.datas = that.originDatas.filter(that.createFilter(that.genes));
        } else {
          that.datas = that.originDatas;
          that.numGenes = that.disease.g.length;
        }
      },
      getGenes: function() {
        let genes = this.$route.query.genes;
        if (!genes) this.genes = [];
        else this.genes = genes.split(',');
      },
      refreshData: function() {
        this.loading = true;
        this.name = this.$route.params.name;
        this.getGenes();
        const that = this;
        that.originDatas.push({});
        this.$http.get('/api/disease/' + this.name).then(res => {
          that.originDatas = res.data.muts;
          that.loading = false;
          that.disease = res.data.dis;
          if (!that.disease)
            that.disease = {g: []};
          if (!that.disease.g)
            that.disease.g = [];
          that.numGenes = that.disease.g.length;
          that.filterData();
        });
      },
      setNumDiss: function(value) {
        this.numDiss = value;
      },
      createFilter: function(filters) {
        return (item) => {
          return filters.indexOf(item.gene) > -1;
        }
      },
      handleClick: function(g) {
        this.$router.replace('/gene/' + g);
      },
      emitTags: function() {
        let tags = [{n: this.name, t: 'disease'}];
        for (let g of this.genes)
          tags.push({n: g, t: 'gene'});
        // this.$emit('emitTags', tags);
      }
    }
  }
</script>

<style scoped>
.button {
  margin: 0 5px;
}

.b-tabs {
  margin-top: 10px;
}

</style>
