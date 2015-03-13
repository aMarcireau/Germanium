var timestamp = require('./../timestamp')

timestamp.prototype.toSrtString = function() {
    return [
        ((this.hours < 10) ? '0' : ''),
        this.hours,
        ':',
        ((this.minutes < 10) ? '0' : ''),
        this.minutes,
        ':',
        ((this.seconds < 10) ? '0' : ''),
        this.seconds,
        ',',
        ((this.milliseconds < 100) ? '0' : ''),
        ((this.milliseconds < 10) ? '0' : ''),
        this.milliseconds,
    ].join('');
};

module.exports = {
    format: 'srt',
    extension: '.srt',

    output: function(titles) {
        return titles.map(function (title) {
            return [
                String(title.index + 1),
                title.start.toSrtString() + ' --> ' + title.end.toSrtString(),
                title.text,
            ].join('\n') + '\n';
        }).join('\n');
    }
}
