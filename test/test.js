var germanium = require('./../');
var path = require('path');

germanium.subtitles(path.resolve(__dirname, './test'), ['srt', 'fcpxml'], [
    [0, 'Le premier sous-titre en français', 500],
    [2, 0, 'Le second sous-titre'],
    [5, 300, 'Le troisième sous-titre', 7, 0],
]);
