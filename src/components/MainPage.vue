<template>
  <section class="container">
    <div class="card">
      <div class="card-header">
        <p class="card-header-title is-centered">
          Relationship of Diseases</p>
      </div>
      <div class="card-content">
        <DisRelDiagram style="height: 700px" name="all">
        </DisRelDiagram>
      </div>
    </div>
    <div class="card dark" ref="geneCard">
      <div class="card-header">
        <div class="card-header-title is-centered dark">
          Relationship of Genes
        <b-switch class="b-switch is-hidden-tablet" v-model="showGenes">
        </b-switch></div>
      </div>
      <keep-alive>
        <GeneRelDiagramCy v-show="showGenes" name="all"/>
      </keep-alive>
    </div>
  </section>
</template>

<script>
  import GeneRelDiagramCy from './gene/GeneRelDiagramCy'
  import DisRelDiagram from './disease/DisRelDiagram'
  export default {
    name: 'MainPage',
    components: {
      DisRelDiagram,
      GeneRelDiagramCy,
      // RoGGraphGL,
    },
    data: () => ({
      activeName: 'gene',
      showGenes: false
    }),
    watch: {
      showGenes: function(cur, old) {
        let card = this.$refs.geneCard;
        if (cur === true) {
           card.style.height ="760px";

        } else {
          // card.style.height = "60px";
          card.style.height = "60px";
        }
      }
    },
    created: function () {
      if (document.body.clientWidth > 600) {
        this.showGenes = true;
      }
    },
  }
</script>

<style scoped>
.card {
  display: block;
  margin-bottom: 20px;
}

.dark {
  background-color: #222;
  color: #ccc;
}

.b-switch {
  margin-left: 16px;
}
</style>
