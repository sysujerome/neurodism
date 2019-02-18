import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '@/components/MainPage'
import Disease from '@/components/disease/Disease'
import Gene from '@/components/gene/Gene'
import Relation from '@/components/relation/Relation'
// import DGRelation from '@/components/relation/DGRelation'
import Search from '@/components/search/Search'
import Documentation from '@/components/Documentation'
import Mutations from '@/components/Mutations'
Vue.use(Router);

let router = new Router({
  mode: 'history',
  base: 'neurodism',
  routes: [
    {
      path: '/',
      name: 'Documentation',
      component: Documentation,
      meta: { keepAlive: true }
    }, {
      path: '/home',
      name: 'Home',
      component: MainPage,
      meta: { keepAlive: true }
    }, {
      path: '/disease/:name',
      name: 'Disease',
      component: Disease,
      meta: { keepAlive: true }
    }, {
      path: '/gene/:name',
      name: 'Gene',
      component: Gene,
      meta: { keepAlive: true }
    }, {
      path: '/relation/:type/:n1/:n2',
      name: 'Relation',
      component: Relation
    }, 
    // {
    //   path: '/relation/:name/:genes',
    //   name: 'Relationship',
    //   component: DGRelation
    // }, 
    {
      path: '/search',
      name: 'Search',
      component: Search,
      meta: { keepAlive: true }
    }, {
      path: '/documentation',
      name: 'Documentation',
      component: Documentation,
      meta: { keepAlive: true }
    }, {
      path: '/mutations',
      name: 'Mutations',
      component: Mutations,
      meta: { keepAlive: true }
    }
  ]
});

export default router;
