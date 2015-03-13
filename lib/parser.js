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
                text: title[1],
                index: index,
            };

            if (title.length < 2) throw  'Subtitle ' + index + ' is missing elements';
            if (title.length == 2) {
                if (index + 1 == titles.length) throw 'The last subtitle must have an end';
                titles[index].push(titles[index + 1][0]);
            }

            validatedTitle.start = new timestamp(title[0]);
            validatedTitle.end = new timestamp(title[2]);

            validatedTitles.push(validatedTitle)
        });

        validatedTitles.forEach(function(validatedTitle, index) {
            if (validatedTitle.start.greaterThan(validatedTitle.end)) throw 'Subtitle ' + String(index + 1) + ' starts after it ends';
            if (index + 1 < validatedTitles.length && validatedTitle.end.greaterThan(validatedTitles[index + 1].start))
                throw 'Subtitle ' + String(index + 1) + ' ends after title ' + String(index + 2) + ' starts';
        });

        return validatedTitles;
    },
}
