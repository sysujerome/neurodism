const model = require('./db');
const express = require('express');
const Promise = require("bluebird");
const path = require('path');
const exec = require('child_process').exec; 
const router = express.Router();

router.get('*', function(req, res, next) {
  if (req.url.indexOf('api') > -1) {
    next();
  } else res.sendFile(path.join(__dirname,'../client/index.html'));
});


router.get('/api/dp/:name', (req, res) => {
  let name = req.params.name;
  let cond = {};
  if (name !== 'all') {
    cond = {
      "$or": [{'d1': name}, {'d2':name}]
    };
  }
  model.dp.find(cond,
    function (err, datas) {
      res.jsonp(datas);
    });
});

router.get('/api/gp/:name', (req, res) => {
  let name = req.params.name;
  let cond = {};
  if (name !== 'all') {
    cond = {
      "$or": [{'g1': name}, {'g2':name}]
    };
  }
  model.gp.find(cond,
    function (err, datas) {
      res.jsonp(datas);
    });
});

router.get('/api/mut/all', (req, res) => {
  model.mut.find({}, function (err, data) {
    res.jsonp(data);
  })
});


router.get('/api/disease/:name', (req, res) => {
  let name = req.params.name;
  // get disease
  let getDis = new Promise((resolve, reject) => {
    model.dis.findOne({d: name}, function (err, data) {
      resolve(data);
    });
  });
  // get mutation
  let getMut = new Promise((resolve, reject) => {
    model.mut.find({pt: name}, function (err, data) {
      resolve(data);
    });
  });
  // join
  Promise.join(getDis, getMut, function(dis, muts) {
    res.jsonp({
      dis: dis,
      muts: muts
    });
  });
});

router.get('/api/gene/:name', (req, res) => {
  let name = req.params.name;
  // get gene
  let getGene = new Promise((resolve, reject) => {
    model.gene.findOne({g: name}, function (err, data) {
      resolve(data);
    });
  });
  // get mutation
  let getMut = new Promise((resolve, reject) => {
    model.mut.find({gene: name}, function (err, data) {
      resolve(data);
    });
  });
  // join
  Promise.join(getGene, getMut, function(gene, muts) {
    res.jsonp({
      gene: gene,
      muts: muts
    });
  });

});

router.get('/api/word/:type', (req, res) => {
  model.word.find({}, function(err, data) {
    res.jsonp(data);
  });
});

router.get('/api/chr/all', (req, res) => {
  let chr = require('./data/ci.json');
  res.jsonp(chr);
});

router.get('/api/relation/:type/:n1/:n2', (req, res) => {
  let type = req.params.type;
  let n1 = req.params.n1;
  let n2 = req.params.n2;
  if (n1 > n2) {
    let type = n1;
    n1 = n2;
    n2 = type;
  }
  if (type === 'gene') {
    model.gp.findOne({g1: n1, g2: n2}, (err, data) => {
      if (data === undefined) data = {};
      res.jsonp(data);
    });
  } else if (type === 'disease') {
    model.dp.findOne({d1: n1, d2: n2}, (err, data) => {
      if (data === undefined) data = {};
      res.jsonp(data);
    });
  }
});

function getPvalue(args) {
  return new Promise((res, rej) => {
    let script = "Rscript ./neurodism/server/r/p_value.R";
    exec(script + ' ' + args, function(err, stdout, stderr) {
      res(stdout.slice(4));
    });
  });
}

router.get('/api/pvalue/:genes', (req, res) => {
  model.dis.find({}, async (err, data) => {
    let gs = req.params.genes.split(',');
    let glen = gs.length;
    let datas = [];
    for (let dis of data) {
      let dglen = dis.g.length;
      let genes = [];
      for (let g of dis.g)
        if (gs.indexOf(g) > -1)
          genes.push(g);
      let n = genes.length;
      if (n === 0) continue;
      let a = n;
      let b = glen - n;
      let c = dglen - n;
      let d = 23341 - glen - dglen + n;
      let pvalue = await getPvalue([a, b, c, d].join(' '));
      datas.push({
        d: dis.d, p: Number(pvalue), g: genes
      });
    }
    res.jsonp(datas);
  });
});

module.exports = router
