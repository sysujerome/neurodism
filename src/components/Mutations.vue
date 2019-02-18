<template>
  <div class="container card">
    <b-loading :is-full-page="false" :active.sync="loading" :canCancel="true"></b-loading>
    <div class="card-header">
      <p class="card-header-title is-centered">All Mutations</p>
    </div>
    <div class="card-content">
      <Table :datas="datas" name="all" :showExport="false"></Table>
    </div>
  </div>
</template>
<script>
  import Table from './Table'
  export default {
    name: 'Mutations',
    components: { Table },
    data: () => ({
      datas: [],
      loading: true
    }),
    created: function () {
      const that = this;
      this.loading = true;
      this.$http.get('/api/mut/all').then(res => {
        that.datas = res.data;
        that.loading = false;
      });
    }
  }
</script>
<style scoped>
  .container {
    margin-top: 20px;
  }
</style>
