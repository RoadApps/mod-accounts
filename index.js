var fs = require('fs');
var path = require('path');
var schemas = {};

exports = module.exports = function(mongoose) {
  fs.readdirSync(__dirname).forEach(function(file) {
    var key = '';
    if (path.extname(file) === '.js' && !/^index\.js$/i.test(file)) {
      if (!schemas[(key = path.basename(file, '.js'))])
        schemas[key] = require(path.join(__dirname, file))(mongoose);
    }
  });
  return schemas;
};
