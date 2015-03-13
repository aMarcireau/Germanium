var germanium = require('./../');
var path = require('path');

germanium.subtitles(path.resolve(__dirname, './test'), 'srt', [
    [[0], 'Le premier sous-titre en français', [2000004]],
    [[400, 0, 0], 'Le second sous-titre', [3, 400, 2, 3]],
    [[4, 400, 2, 3], 'Le troisième sous-titre', [5, 400, 2, 3]],
]);
