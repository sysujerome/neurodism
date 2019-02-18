<template>
<section>
  <b-field grouped>
    <div class="control">
        <b-input size="is-small" v-model="filter" placeholder="Filter"></b-input>
    </div>
    <div v-show="showExport" class="control">
        <a class="button is-rounded is-outlined is-small" 
          @click="saveToCSV">
          Export to CSV</a>
    </div>
  </b-field>
  <b-table style="font-size: 0.9em"
    :data="tabledata"
    paginated
    pagination-size="is-small"
    backend-pagination
    :total="total"
    :per-page="perPage"
    @page-change="onPageChange"

    backend-sorting
    :default-sort-direction="defaultSortOrder"
    :default-sort="[sortField, sortOrder]"
    @sort="onSort"
    hoverable
    narrowed
    detailed>
    <template slot-scope="props">
      <b-table-column v-for="col in shows" 
        :field="col" :key="col"
        :label="dict[col]" centered sortable>
        {{props.row[col]}}
      </b-table-column>
    </template>
    <template slot="detail" slot-scope="props">
      <div class="columns is-multiline">
        <div class="column is-half" v-for="col in hides" :key="col">
          <div class="columns">
            <div class="column has-text-grey-dark"><b>{{dict[col]}}</b></div>
            <div class="column">{{props.row[col]}}</div>
          </div>
        </div>
      </div>
    </template>
  </b-table>
</section>
</template>

<script>
  export default {
    name: "Table",
    props: {
      name: {
        default: 'all'
      }, 
      datas: {
        default: []
      }, 
      showExport: {
        default: true
      }
    },
    data: () => ({
      tabledata: [],
      dict: {
        n: "name", t: "type", m: "mutation", p: "path",
        d: "disease", d1: "disease 1", d2: "disease 2",
        g: "gene", g1: "gene 1", g2: "gene 2", gene: "gene",
        v: "p-value", s: "significant", c: "chr", b: "begin", e: "end",
        id: "sample id", pid: "pubmed id", st: "sequence type", pt: "phenotype",
        chr: "chr", pos: "position", pro: "probands", pop: "population",
        ref: "ref", ale: "ale", fc: "function category", pv: "ptein Variant",
        var: "variation", val: "validation", mut: "mutation or not"
      },
      hides: ['st', 'pro', 'pop', 'var', 'val', 'fc', 'pv', 'mut'],
      shows: ['id', 'pid', 'pt', 'gene', 'chr', 'pos', 'ref', 'ale'],
      filter: '',
      total: 0,
      loading: false,
      sortField: '',
      sortOrder: 'asc',
      defaultSortOrder: 'asc',
      page: 1,
      perPage: 16
    }),
    computed: {
      lowerCaseFilter: function() {
        return this.filter.toLowerCase();
      }
    },
    watch: {
      datas: function(cur, old) {
        this.refreshData();
      }
    },
    mounted: function () {
      this.refreshData();
    },
    methods: {
      refreshData: function() {
        if (this.datas === undefined || this.datas.length === 0) return;
        this.perPage = this.name === 'all' ? 16 : 12;
        this.tabledata = this.datas.slice(this.perPage * (this.page-1), 
          this.perPage * this.page);
        this.total = this.datas.length;
      },
      onPageChange(page) {
        this.page = page;
        this.refreshData();
      },
      onSort(field, order) {
        this.sortField = field;
        this.sortOrder = order;
        this.page = 1;
        this.datas.sort(this.compare(this.sortField, this.sortOrder === 'desc'));
        this.refreshData();
      },
      compare(key, desc) {
        return function (a, b) {
          let x = 0;
          if (a[key] < b[key]) x = -1;
          else if (a[key] > b[key]) x = 1;
          if (desc) x *= -1;
          return x;
        }
      },
      saveToCSV: function () {
        let keys = Object.keys(this.datas[0]);
        keys.shift(); 
        keys.pop()
        let field = keys.map(key => ({
          value: key,
          label: dict[key]
        }));
        this.exportToCSV(this.data, field, 
          this.name + "_related_mutations");
      },
    }
  }
</script>

<style scoped>
</style>
