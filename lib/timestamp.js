module.exports = function(timelist) {
    if (timelist.length == 0) throw 'The time list must have at least one element';

    this.milliseconds = 0;
    this.seconds = 0;
    this.minutes = 0;
    this.hours = 0;

    if (timelist.length == 1) { 
        this.milliseconds = timelist[0];
    } else if (timelist.length == 2) {
        this.milliseconds = timelist[1];
        this.seconds      = timelist[0];
    } else if (timelist.length == 3) {
        this.milliseconds = timelist[2];
        this.seconds      = timelist[1];
        this.minutes      = timelist[0];
    } else if (timelist.length == 4) {
        this.milliseconds = timelist[3];
        this.seconds      = timelist[2];
        this.minutes      = timelist[1];
        this.hours        = timelist[0];
    } else {
        throw 'The time list is too long';
    }

    this.seconds += Math.floor(this.milliseconds / 1000);
    this.milliseconds = this.milliseconds % 1000;
    this.minutes += Math.floor(this.seconds / 60);
    this.seconds = this.seconds % 60;
    this.hours += Math.floor(this.minutes / 60);
    this.minutes = this.minutes % 60;

    this.inMilliseconds = this.milliseconds + this.seconds * 1000 + this.minutes * 60000 + this.hours + 3600000;

    this.greaterThan = function(other) {
        return this.inMilliseconds > other.inMilliseconds;
    };
};
