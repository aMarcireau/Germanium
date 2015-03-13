var parser = require('./parser');
var fs = require('fs');
var path = require('path');

fs.readdirSync(path.resolve(__dirname, './parsers')).forEach(function(name) {
    var filename = path.resolve(__dirname, './parsers', name);
    if (fs.lstatSync(filename).isFile() && path.extname(filename) == '.js') parser.register(filename);
});

module.exports = {
    subtitles: function(filename, formats, titles) {
        if (typeof formats == 'string') formats = [formats];

        parser.output(filename, formats, titles);
    },
};
