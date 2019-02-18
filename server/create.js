const csv = require('csvtojson');
const model = require('./db');
const Promise = require("bluebird");

function getMutations() {
  // const mutFile = './mut.csv';
  return new Promise(resolve => {
    csv().fromFile('./data/mut.csv')
      .on('end_parsed', (data) => {
        resolve(data);
      });
  });
}

function getGenes() {
  return new Promise(resolve => {
    csv().fromFile('./data/genes.csv')
      .on('end_parsed', (data) => {
        resolve(data);
      });
  });
}

function getWordsAndDiss(muts) {
  let diss = {};
  let geneSet = new Set();
  for (let mut of muts) {
    if (diss[mut.pt] === undefined)
      diss[mut.pt] = {
        g: new Set(),
        m: new Set()
      }
    diss[mut.pt].g.add(mut.gene);
    diss[mut.pt].m.add(mut.chr+'_'+mut.pos+'_'+mut.ref+'_'+mut.ale);

    geneSet.add(mut.gene);
  }
  let disWords = Object.keys(diss);
  return [disWords, [...geneSet], diss];
}

function getPvalues() {
  return new Promise(resolve => {
    csv().fromFile('./data/dp.csv')
      .on('end_parsed', (data) => {
        resolve(data);
      });
  });
}

function makePair(a, b) {
  if (a > b)
    [a, b] = [b, a];
  return [a, b, a+'*'+b];
}

const intersect = (set1, set2) => [...set1]
  .filter(item => set2.has(item))

async function getDisPairs(disWords, diss) {
  let pvalues = await getPvalues();
  let disPairs = {};
  for (let p of pvalues) {
    let [d1, d2, dp] = makePair(p.d1, p.d2);
    if (disPairs[dp] === undefined) {
      disPairs[dp] = {
        d1: d1, d2: d2,
        v: {
          g: p.p1,
          m: p.p2,
          p: p.p3
        },
        s: p.sig,
        g: intersect(diss[d1].g, diss[d2].g),
        m: intersect(diss[d1].m, diss[d2].m)
      };
    }
  }
  // let len = disWords.length;
  // for (let i = 0; i < len; i++) {
  //   for (let j = i+1; j < len; j++) {
  //     let [d1, d2, dp] = makePair(disWords[i], disWords[j]);
  //     disPairs[dp].g = intersect(diss[d1].g, diss[d2].g);
  //     disPairs[dp].m = intersect(diss[d1].m, diss[d2].m);
  //   }
  // }
  return disPairs;
}

function getGenePairs(muts) {
  let len = muts.length;
  let genePairs = {};
  for (let i = 0; i < len; i++) {
    for (let j = i+1; j < len; j++) {
      if (muts[i].pt !== muts[j].pt) continue;
      let [g1, g2, gp] = makePair(muts[i].gene, muts[j].gene);
      if (g1 === g2) continue;
      if (genePairs[gp] === undefined)
        genePairs[gp] = {
          g1: g1, g2: g2,
          d: new Set()
        };
      genePairs[gp].d.add(muts[i].pt);
    }
  }
  return genePairs;
}


async function creating() {
  console.log('Deleting All...');
  await model.drop();
  console.log('Collecting Data...');
  let muts = await getMutations();
  console.log('Got Muts');
  let genes = await getGenes();
  console.log('Got Genes');
  let [disWords, geneWords, diss] = getWordsAndDiss(muts);
  console.log('Got Words and Diss');
  let disPairs = await getDisPairs(disWords, diss);
  console.log('Got Disease Pairs');
  let genePairs = getGenePairs(muts);
  console.log('Got Gene Pairs');

  console.log('Saving to Database...');
  muts.map(obj => {
    (new model.mut(obj)).save();
  });
  disWords.map(name => {
    (new model.word({
      n: name, t: 'd'
    })).save();
  });
  geneWords.map(name => {
    (new model.word({
      n: name, t: 'g'
    })).save();
  });
  for (let name of disWords) {
    (new model.dis({
      d: name, g: [...diss[name].g], m: diss[name].m.size
    })).save();
  }
  genes.map(obj => {
    (new model.gene(obj)).save();
  });
  for (let dp in disPairs) {
    (new model.dp(disPairs[dp])).save();
  }
  for (let gp in genePairs) {
    let obj = genePairs[gp];
    obj.d = [...obj.d];
    (new model.gp(obj)).save();
  }
}

creating();
