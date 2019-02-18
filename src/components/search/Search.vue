<template>
<section>
<div class="container card">
  <header class="card-header">
    <p class="card-header-title">Advanced Search</p>
  </header>
  <div class="card-content">
    <div class="field is-horizontal is-grouped">
        <label class="label">Search Type</label>
        <p class="control">
        <a class="button is-small btn-list" 
            v-for="type in searchType"
            :class="type === selectedType ? 'is-primary is-outlined' : 'is-white'"
            :key="type"
            @click="switchType(type)">{{type}}</a>
        </p>
    </div>
    <b-field v-show="selectedType === 'Custom'">
      <b-input v-model="disease" placeholder="Disease Name"></b-input>
      <b-input expanded v-model="genes" placeholder="A List of Gene Symbols (sperate by one white-space)"></b-input>
    </b-field>
    <b-field v-show="selectedType === 'File'" class="file">
        <b-dropdown hoverable>
            <button class="button is-outlined is-rounded" slot="trigger">
                <b-icon icon="question" size="is-small"></b-icon>
            </button>

            <b-dropdown-item>Upload a file with following format in each line:</b-dropdown-item>
            <b-dropdown-item><b>One disease name</b> and <b>A list of gene symbols</b>(seperated by a space)</b-dropdown-item>
            <b-dropdown-item>For example:</b-dropdown-item>
            <b-dropdown-item>migraine PRRT2 SCN1A KCNK18 CACNA1A<br>stroke ENPP1 GLA SCN1A NOTCH3</b-dropdown-item>
        </b-dropdown>
        <b-upload v-model="files">
        <a class="button is-outlined">
            <b-icon icon="upload" size="is-small"></b-icon>
            <span>Upload File</span>
        </a>
        </b-upload>


        <span class="button is-success is-outlined"
            v-if="files && files.length">
            {{ files[0].name }}
        </span>
    </b-field>
    <div v-show="selectedType === 'Relation'" class="field has-addons">
      <p class="control is-expanded">
        <SimpleInput 
          placeholder="Select one disease or gene from popup list"
          @emitTag="item => {item0 = item}"></SimpleInput>
      </p>
      <p class="control is-expanded">
        <SimpleInput :showType="item0.t"
          :placeholder="item0.n === '' ? 
          'Please select left one first' 
          : ('Select another ' + item0.t + ' from popup list')"
          @emitTag="item => {item1 = item}"></SimpleInput>
      </p>
    </div>
    <a v-show="selectedType === 'Relation' || selectedType === 'File'" style="margin-top: 10px" class="button is-rounded is-outlined is-primary" @click="handleQuery">Query</a>
    <div v-show="selectedType === 'Disease or Gene'" class="field">
      <SimpleInput @emitTag="handleRoute"></SimpleInput>
    </div>
  </div>
</div>
<DGRelation v-show="selectedType === 'Custom' && genes.length > 0" :name="disease" :genestr="genes"></DGRelation>

<DGRelation v-show="selectedType === 'File' && dgDatas.length" 
    v-for="data in dgDatas" :key="data.name"
    :name="data.name" :genestr="data.genestr"></DGRelation>
</section>
</template>

<script>
import SimpleInput from './SimpleInput'
import DGRelation from '../relation/DGRelation'
export default {
  name: 'Search',
  components: { SimpleInput, DGRelation },
  data: () => ({
    searchType: ["Custom", "File", 
      "Relation", "Disease or Gene"],
    selectedType: "Custom",
    disease: '',
    files: [],
    dgDatas: [],
    genes: '',
    item0: {n: '', t: ''},
    item1: {n: '', t: ''}
  }),
  methods: {
    switchType: function (type) {
        this.selectedType = type;
    },
    handleQuery: function () {
      if (this.selectedType === 'File') {
        if (this.files && this.files.length > 0) {
          this.dgDatas = [];
          let reader = new FileReader();
          reader.readAsText(this.files[0]);
          const that = this;
          reader.onload = (e) => {
            let rows = e.target.result.split('\n');
            for (let row of rows) {
              let items = row.split(' ');
              if (items.length < 2) continue;
              that.dgDatas.push({
                name: items[0],
                genestr: items.slice(1).join(' ')
              });
            }
          };
        }
      }
      if (this.selectedType === 'Relation') {
        if (this.item0.t === this.item1.t) {
          this.$router.replace('/relation/' 
            + this.item0.t + '/' 
            + this.item0.n + '/' + this.item1.n);
        }
      }
    },
    handleRoute: function(item) {
      if (item.t === '') return;
      this.$router.replace('/' + item.t + '/' + item.n);
    },
  }
}
</script>

<style scoped>
  .card {
    margin-top: 20px;
  }

  .label {
    margin-right: 16px;
  }

  .button {
    margin-right: 10px;
  }

</style>
