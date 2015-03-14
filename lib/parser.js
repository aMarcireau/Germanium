var fs = require('fs');
var timestamp = require('./timestamp')

module.exports = {
    parsers: [],
    availableFormats: [],

    register: function(parserPath) {
        var parser = require(parserPath);
        this.parsers.push(parser);
        this.availableFormats.push(parser.format);
    },

    invalidFormats: function(formats) {
        var invalidFormats = [];

        var parent = this;
        formats.forEach(function(format) {
            if (parent.availableFormats.indexOf(format) == -1) {
                invalidFormats.push(format);
            };
        });

        return invalidFormats;
    },

    output: function(filename, formats, titles) {
        var invalidFormats = this.invalidFormats(formats);
        if (invalidFormats.length > 0) throw [
            'Unknown formats: ',
            invalidFormats.join(', '),
            '(available formats: ',
            this.availableFormats.join(', '),
            ')'
        ].join('');

        var validatedTitles = this.validate(titles);

        this.parsers.forEach(function(parser) {
            if (formats.indexOf(parser.format) > -1) {
                fs.writeFile(filename + parser.extension, parser.output(validatedTitles), function(err) {
                    if (err) throw err;
                });
            }
        });
    },

    validate: function(titles) {
        var validatedTitles = []

        titles.forEach(function(title, index) {
            var validatedTitle = {
                index: index,
            };

            var current = 'start';
            var startList = [];
            var endList = [];
            for (var elementIndex = 0; elementIndex < title.length; elementIndex++) {
                var element = title[elementIndex];
                if (current == 'start') {
                    if (typeof element == 'number') {
                        startList.push(element);
                    } else if (typeof element == 'string') {
                        validatedTitle.text = element;
                        current = 'end';
                    } else {
                        throw 'Subtitle ' + index + ' has an element which neither numebr nor string';
                    }
                } else {
                    if (typeof element == 'number') {
                        endList.push(element);
                    } else {
                        throw 'Subtitle ' + index + ' has an unexpected not-number element';
                    }
                }
            }

            if (null == validatedTitle.text) throw  'Subtitle ' + index + ' is missing elements';
            if (index + 1 == titles.length && endList.length == 0) throw 'The last subtitle must have an end';

            validatedTitle.start = new timestamp(startList);
            if (endList.length > 0) validatedTitle.end = new timestamp(endList);
            validatedTitles.push(validatedTitle)
        });

        validatedTitles.forEach(function(validatedTitle, index) {
            if (null == validatedTitle.end) validatedTitle.end = validatedTitles[index + 1].start;
            if (validatedTitle.start.greaterThan(validatedTitle.end)) throw 'Subtitle ' + String(index + 1) + ' starts after it ends';
            if (index + 1 < validatedTitles.length && validatedTitle.end.greaterThan(validatedTitles[index + 1].start))
                throw 'Subtitle ' + String(index + 1) + ' ends after title ' + String(index + 2) + ' starts';
        });

        return validatedTitles;
    },
}
