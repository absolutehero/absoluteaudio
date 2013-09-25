/**
 * Created by craig on 9/24/13.
 */
define(function () {

    var CordovaClip = function (url, onLoaded) {
        this.init(url, onLoaded);
    };

    CordovaClip.constructor = CordovaClip;

    CordovaClip.prototype.init = function (url, onLoaded) {
        this.clip = new Media(url, function () {
            if (this.loop && !this.cancelled) {
                this.clip.play();
            }
            else if (this.onComplete && typeof this.onComplete === 'function') {
                this.onComplete();
            }
        }.bind(this));
        this.muted = false;
        this.cancelled = false;
        this.paused = true;
        if (onLoaded && typeof onLoaded === 'function') {
            onLoaded();
        }
    };

    CordovaClip.prototype.seek = function (offset) {

    };

    CordovaClip.prototype.play = function (delay, loop, onComplete) {
        this.delay = delay;
        this.loop = loop;
        this.onComplete = onComplete;
        var _delay = delay || 0;

        this.paused = false;
        this.cancelled = false;

        if (_delay > 0) {
            setTimeout(function () {
                this.clip.play();
            }.bind(this), _delay * 1000);
        }
        else {
            this.clip.play();
        }

    };


    CordovaClip.prototype.pause = function () {
        this.clip.pause();
        this.paused = true;
    };

    CordovaClip.prototype.stop = function () {
        this.cancelled = true;
        this.clip.stop();
    };

    CordovaClip.prototype.setVolume = function (volume) {

    };

    CordovaClip.prototype.getVolume = function () {

    };

    CordovaClip.prototype.mute = function () {
        setTimeout(function () { this.clip.setVolume('0.0'); this.muted = true; }.bind(this), 0);
    };

    CordovaClip.prototype.unmute = function () {
        setTimeout(function () { this.clip.setVolume('1.0'); this.muted = false; }.bind(this), 0);
    };

    CordovaClip.prototype.isMuted = function () {
        return this.muted;
    };

    CordovaClip.prototype.prime = function () {

    };

    return CordovaClip;

});