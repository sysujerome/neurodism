const Json2csvParser = require('json2csv').Parser;
function createDownloadLink(url, filename) {
  let link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
export default {
  install(Vue, options) {
    Vue.prototype.exportToCSV = function (data, fields, fileName) {
      const parser = new Json2csvParser({ fields, quote: '' });
      const result = parser.parse(data);
      var csvContent = 'data:text/csvcharset=GBK,\uFEFF' + result
      var encodedUri = encodeURI(csvContent);
      createDownloadLink(encodedUri, `${(fileName || 'file')}.csv`);
    },
    Vue.prototype.exportAsSVG = function (svg, fileName) {
      let serializer = new XMLSerializer();
      let source = serializer.serializeToString(svg);
      source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
      const url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);
      createDownloadLink(url, fileName + '.svg');
    },
    Vue.prototype.download = function (url, name) {
      createDownloadLink(url, name);
    },
    Vue.prototype.apiserver = 'http://193.112.28.37';
  }
}