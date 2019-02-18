<template>
  <div class="container card">
    <div class="card-header">
    <div class="card-header-title is-centered">
      Relationship between
      <a class="button is-small is-outlined" :class="type==='gene'?'is-success':'is-danger'" @click="handleClick(pair.n1.n, pair.n1.t)">{{pair.n1.n}}</a>
      and
      <a class="button is-small is-outlined" :class="type==='gene'?'is-success':'is-danger'" @click="handleClick(pair.n2.n, pair.n2.t)">{{pair.n2.n}}</a>
    </div>
    </div>
    <div class="card-content" v-show="type === 'disease'">
      <div class="item">
        <p class="header">Shared Genes</p>
        <a class="button is-small is-outlined is-success" v-for="g in data.g" :key="g" @click="handleClick(g, 'gene')">{{g}}</a>
      </div>
      <div class="item" style="display: inline-block; width: 100%; max-width: 800px">
        <p class="header">Shared Mutations</p>
        <a class="button is-small is-outlined is-warning" v-for="m in data.m" :key="m">{{m}}</a>
      </div>
      <div class="item">
        <div class="header">P-Values</div>
        <div class="columns">
          <div class="column"></div>
          <div class="column is-three-fifths">
              <b-table :data="tableData" :columns="columns" hoverable></b-table>
          </div>
          <div class="column"></div>
        </div>
      </div>
    </div>
    <div class="card-content" v-show="type === 'gene'">
      <div class='header'>Shared Disease</div>
      <a class="button is-small is-outlined is-danger" v-for="d in data.d" :key="d"
        @click="handleClick(d, 'disease')">{{d}}</a>
    </div>
  </div>
</template>

<script>
  import Table from '../Table'
  export default {
    name: "Relation",
    components: {
      Table
    },
    data: () => ({
      type: '',
      data: null,
      tableData: [],
      columns: [
        { field: 'type', label: 'type', centered: true }, 
        { field: 'value', label: 'p-value', centered: true }, 
        { field: 'rem', label: 'remarkable', centered: true }
      ],
      pair: {n1: {n: '', t: ''}, n2: {n: '', t: ''}}
    }),
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
        this.type = this.$route.params.type;
        this.pair.n1 = {
          n: this.$route.params.n1,
          t: this.type
        };
        this.pair.n2 = {
          n: this.$route.params.n2,
          t: this.type
        };
        // alert(this.$route.params.n1);
        this.data = {g:[], m: [], p: [], d: []};
        const that = this;
        this.$http.get('/api' + this.$route.path).then(res => {
          that.data = res.data;
          if (that.type === 'disease') {
            if (that.data === null) {
              that.data = {g: [], m: [], v: {g: null, m: null, p: null}};
            }
            if (that.data.g.length === 0)
              that.data.g = ['None'];
            if (that.data.m.length === 0)
              that.data.m = ['None'];
            that.tableData = [
              {type: 'gene', value: (that.data.v.g === null ? 'null' : that.data.v.g),
                rem: (that.data.v.g !== null && that.data.v.g < 0.005 ? 'Yes' : 'No')},
              {type: 'mutation', value: (that.data.v.m === null ? 'null' : that.data.v.m),
                rem: (that.data.v.m !== null && that.data.v.m < 0.005 ? 'Yes' : 'No')},
              {type: 'pathway', value: (that.data.v.p === null ? 'null' : that.data.v.p),
                rem: (that.data.v.p !== null && that.data.v.p < 0.005 ? 'Yes' : 'No')}
            ]
          } else if (that.type === 'gene') {
            if (!that.data) that.data = {};
            if (that.data.d === undefined || that.data.d.length === 0)
              that.data.d = ['None'];
          }
        });
      },
      handleClick: function(name, type) {
        if (name === 'None') return;
        this.$router.replace('/' + type + '/' + name);
      }
    }
  }
</script>

<style scoped>
.card {
  text-align: center;
  height: auto;
}

.button {
  margin: 5px;
}

.header {
  margin: 10px;
}

</style>
