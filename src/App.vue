<template>
  <section>
    <nav class="navbar is-light" role="navigation" aria-label="main navigation">
    <div class="container">
      <div class="navbar-brand">
        <router-link class="navbar-item has-text-primary" to="/">
          <span class="logo">Neurodism</span>
        </router-link>
      </div>
      <div class="navbar-menu is-active">
        <div class="navbar-end">
          <router-link v-for="item in navItem" :key="item.name" class="navbar-item" :class="getCurActive(item.name)"
          :to="item.path">{{item.name}}</router-link>
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              Contact US
            </a>
            <div class="navbar-dropdown is-right is-boxed">
              <div class="dropdown-item">
              <a class="has-text-dark" @click="outTo('mailto:zhaohy8@mail.sysu.edu.cn')"><span class="has-text-info"><i class="fa fa-at"></i></span>&nbsp&nbsp
              zhaohy8@mail.sysu.edu.cn</a>
              </div>
              <hr class="navbar-divider">
              <div class="dropdown-item">
              <a class="has-text-dark" @click="outTo('https://j.map.baidu.com/JVGrP')"><span class="has-text-success"><i class="fa fa-map-marker"></i></span>&nbsp&nbsp
              Sun Yat-sen Memorial Hospital, Sun Yat-sen University, Guangzhou 510000, China</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </nav>
    <div class="container is-margin-tb" v-show="showSearchAndBread">
      <SimpleInput class="is-margin-tb" @emitTag="handleRoute"></SimpleInput>

      <div class="field is-grouped is-grouped-multiline" >
        <router-link class="control" v-for="bread in breadList" :key="bread[0]" :to="bread[0]">
          <div class="tags has-addons">
            <span class="tag" :class="setClass(bread[1])">{{bread[1]}}</span>
            <span v-show="bread[2] !== ''" class="tag">{{bread[2]}}</span>
          </div>
        </router-link>
        <div class="control">
          <div class="tags has-addons">
            <span class="tag" :class="setClass(curBread[1])">{{curBread[1]}}</span>
            <span v-show="curBread[2] !== ''" class="tag">{{curBread[2]}}</span>
          </div>
        </div>
      </div>
    </div>
    <div>
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
  </section>
</template>
<script>
  import SimpleInput from './components/search/SimpleInput'
  export default {
    name: 'App',
    components: { SimpleInput },
    data () {
      return {
        breadList: [],
        curBread: ['/home', 'Home', ''],
        showSearchAndBread: true,
        navItem: [
          { name: 'Home', path: '/home' },
          { name: 'Search', path: '/search' },
          { name: 'Documentation', path: '/documentation' }
        ]
      };
    },
    created() {
      this.refreshBreadList(this.$route);
    },
    watch: {
      $route (to, from) {
        this.refreshBreadList(to);
      },
      curBread (cur, old) {
        this.navItem[0].path = cur[0];
      }
    },
    methods: {
      refreshBreadList: function (to) {
        if (to.name === 'Search' 
          || to.name === 'Documentation' 
          || to.name === 'Help'
          || to.name === 'Mutations') {
          this.showSearchAndBread = false;
          return;
        }
        this.showSearchAndBread = true;
        if (to.name === 'Home') {
          this.curBread = ['/home', 'Home', ''];
          this.breadList = [];
          return;
        }
        if (this.curBread[0] !== '')
          this.breadList.push(this.curBread);
        let args = to.path.split('/');
        let type = '';
        let name = '';
        if (args.length === 5) {
          name = "Relation"
          args = [args[3], args[4]].join(' | ');
        }
        else {
          name = to.name;
          args = args[2];
        }
        let path = to.path;
        if (to.name === 'Relationship') {
          name = 'Relation';
          args = to.params.name;
        }
        if (to.name === 'Disease' && to.query.genes !== undefined) {
          path += '?genes=' + to.query.genes;
        }

        let idx = -1;
        for (let i = 0; i < this.breadList.length; i++) {
          if ((this.breadList[i][1] + this.breadList[i][2]) === (name + args)) {
            idx = i;
            break;
          }
        }
        if (idx > -1) this.breadList.splice(idx, 1);
        this.curBread = [path, name, args];
      },
      routeTo: function (path) {
        this.$router.replace(path);
      },
      handleRoute: function(item) {
        if (item.t === '') return;
        this.$router.replace('/' + item.t + '/' + item.n);
      },
      outTo: function (path) {
        window.open(path);
      },
      setClass: function (name) {
        return (name === 'Disease' ? 'is-danger' 
              : name === 'Gene' ? 'is-success' 
              : name === 'Home' ? 'is-light' 
              : 'is-warning');
      },
      getCurActive: function (name) {
        if (this.$route.name === name) 
          return 'is-active';
        if (this.showSearchAndBread && name === 'Home')
          return 'is-active';
        return '';
      }
    }
  }
</script>
<style scoped>
  .logo {
    font: 24px Optima;
    font-weight: bold;
    /*color: #b71c1c;*/
  }

  .is-margin-tb {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  @media screen and (min-width: 1024px) {
    .navbar-dropdown {
      width: 20em;
    }
  }


</style>
