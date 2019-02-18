<template>
<section>
<section class="hero has-text-left is-primary">
  <div class="hero-body">
    <div class="container">
      <h1 class="title">
        Introduction
      </h1>
      <h2 class="subtitle">
        <p>NeurodisM is a database containing mutations and genes related with diseases of the nervous system, and relationships between the diseases.</p>
      <p>NeurodisM is able to construct a disease network with disease and gene information input by users, and able to help to find the candidate genes related with diseases.</p>
      </h2>
    </div>
  </div>
</section>
<div class="container" style="margin-top: 20px">
<div class="tile is-ancestor">
  <div class="tile is-parent">
    <article class="tile is-child box">
      <p class="title">Main Features</p>
      <div class="content">
      <ul>
      <li><b>Disease network</b> constructed by assessing significance of shared mutations and genes between 21 diseases.</li>
      <li>Constructing disease network with <b>users input</b> disease and gene information.</li>
      <li><b>Gene network</b> constructed by connecting genes relate with the same disease.</li>
      </ul>
      </div>
    </article>
  </div>
  <div class="tile is-5 is-parent">
    <article class="tile is-child box">
      <p class="title">Resource</p>
      <p>Clicking on <a class="button is-small is-outlined is-rounded">Save as PNG</a> or <a class="button is-small is-outlined is-rounded">Export to CSV</a> to download data of a specific disease.</p>
      <p>Or Viewing all mutations related with diseases of the nervous system:</p>
      <router-link style="margin-top: 16px" class="button is-outlined is-rounded is-primary" to="/mutations">View All Mutations</router-link>
    </article>
  </div>
</div>
<div class="tile is-ancestor">
  <div class="tile is-parent">
    <div class="tile is-child box">
      <p class="title">Help</p>
      <div class="content">
        <h3>How to search NeurodisM ?</h3>
        <h5>1. By user input</h5>
        <p>Go to the search box under the topbar, just type the search item, disease name or gene symbol, and then select which you want in the popup list.</p>
        <p>The search items in NeurodisM include:</p>
        <ul>
          <li>Gene symbols, e.g. <router-link class="button is-small is-success is-outlined" to="/gene/CACNA1A">CACNA1A</router-link></li>
          <li>Disease name, e.g. <router-link class="button is-small is-danger is-outlined" to="/disease/migraine">Migraine</router-link></li>
<!--           <li>Mutation, in format “chr location”, e.g. “12  40340362”</li> -->
        </ul>
        <h5>2. By clicking on diseases or genes <router-link to="/home">here</router-link>, or in any charts.</h5>
        <hr>
        <h3>How to build disease network by customer input ?</h3>
        <p>Click the <router-link class="button is-small" to="/search">Search</router-link> 
        showing on the top bar, it will direct you to the advanced search page.</p>
        <p>In this page, you can type a disease name specified by yourself and a group of genes separated by a space.</p>
        <p>You can also upload a file contains one disease name and a list of gene symbols(seperated by a space) in each line after choosing <span class="tag">File</span>search type.</p>
        <p>For Example:</p>
        <blockquote>migraine PRRT2 SCN1A KCNK18 CACNA1A<br>stroke ENPP1 GLA SCN1A NOTCH3</blockquote>
        <p>If you like to download the result, please click on <a class="button is-small is-outlined is-rounded">Save as PNG</a> or <a class="button is-small is-outlined is-rounded">Export to CSV</a> on the left top of the output.</p>
      </div>
    </div>
  </div>
</div>
</div>
</div>
</section>
</template>
<script>
  export default {
    name: 'Documentation',
    data: () => ({
    }),
  }
</script>
<style scoped>
</style>
