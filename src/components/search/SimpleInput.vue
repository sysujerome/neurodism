<template>
  <b-autocomplete
      v-model="value"
      type="search"
      :placeholder="placeholder"
      :keep-first="false"
      :open-on-focus="true"
      :data="filteredDataObj"
      field="n"
      @select="handleSelect">
      <template slot-scope="props">
        {{ props.option.n }}
        <small>{{props.option.t}}</small>
      </template>
  </b-autocomplete>
</template>
<script>
  export default {
    name: 'SimpleInput',
    props: {
      placeholder: {
        type: String,
        default: "Discover Disease or Gene in Our Database"
      },
      showType: {
        default: ''
      }
    },
    data: () => ({
      words: [],
      value: ''
    }),
    created() {
      let that = this;
      this.$http.get('/api/word/all').then(res => {
        that.words = res.data.map((obj) => {
          return {
            t: obj.t === 'g' ? 'gene' : 'disease',
            n: obj.n
          };
        });
      });
    },
    computed: {
      filteredDataObj() {
          return this.words.filter((word) => {
            if (this.showType !== '' 
                    && word.t !== this.showType)
              return false;
            return word.n.toLowerCase()
                  .indexOf(this.value.toLowerCase()) >= 0;
          });
      }
    },
    methods: {
      handleSelect(opt) {
        // this.$router.push('/' + opt.t 
        //   + '/' + opt.n);
        if (opt === null)
          this.$emit('emitTag', {n: '', t: ''});
        this.$emit('emitTag', {n: opt.n, t: opt.t});
      }
    }
  }
</script>
<style scoped>
</style>
