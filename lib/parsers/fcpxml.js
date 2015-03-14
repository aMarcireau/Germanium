var timestamp = require('./../timestamp');

timestamp.prototype.toFcpxmlTime = function() {
    return Math.ceil(this.inMilliseconds / 40) * 100;
};

var tabulation = function(indent) {
    return new Array(indent + 1).join('    ');
};

var structure = {
    header: function(timestamp) {
        return [
            '<?xml version="1.0" encoding="UTF-8" standalone="no"?>',
            '<!DOCTYPE fcpxml>',
            '',
            '<fcpxml version="1.4">',
            tabulation(1) + '<resources>',
            tabulation(2) + '<format id="r1" name="FFVideoFormat1080p25" frameDuration="100/2500s" width="1920" height="1080"/>',
            tabulation(2) + '<effect id="r2" uid="~/Titles.localized/Paragraph/Paragraph.moti"/>',
            tabulation(1) + '</resources>',
            tabulation(1) + '<library>',
            tabulation(2) + '<event>',
            tabulation(3) + '<project>',
            tabulation(4) + [
                '<sequence duration="',
                timestamp.toFcpxmlTime(),
                '/2500s" format="r1">',
            ].join(''),
            tabulation(5) + '<spine>',
            tabulation(6) + [
                '<gap name="Espace" offset="0s" duration="',
                timestamp.toFcpxmlTime(),
                '/2500s">',
            ].join(''),
        ].join('\n');
    },
    subtitle: function(title, declareStyle) {
        return [
            tabulation(7) + [
                '<title name="Subtitle ',
                title.index,
                '" lane="1" offset="',
                title.start.toFcpxmlTime(),
                '/2500s" ref="r2" duration="',
                title.end.toFcpxmlTime() - title.start.toFcpxmlTime(),
                '/2500s">',
            ].join(''),
            tabulation(8) + '<text>',
            tabulation(9) + '<text-style ref="ts1">' + title.text + '</text-style>',
            tabulation(8) + '</text>' + (declareStyle ? [
                '\n' + tabulation(8) + '<text-style-def id="ts1">',
                tabulation(9) + [
                    '<text-style',
                    'font="Helvetica" fontSize="67" fontFace="Regular" fontColor="1 1 1 1"',
                    'alignment="center" lineSpacing="10"',
                    'strokeColor="0 0 0 1" strokeWidth="4"/>',
                ].join(' '),
                tabulation(8) + '</text-style-def>',
            ].join('\n') : ''),
            tabulation(7) + '</title>',
        ].join('\n');
    },
    footer: [
        tabulation(6) + '</gap>',
        tabulation(5) + '</spine>',
        tabulation(4) + '</sequence>',
        tabulation(3) + '</project>',
        tabulation(2) + '</event>',
        tabulation(1) + '</library>',
        '</fcpxml>',
    ].join('\n'),
};

module.exports = {
    format: 'fcpxml',
    extension: '.fcpxml',

    output: function(titles) {
        return [
            structure.header(titles[titles.length - 1].end),
            titles.map(function(title, index) {
                return structure.subtitle(title, index == 0);
            }).join('\n'),
            structure.footer,
        ].join('\n') + '\n';
    }
}
