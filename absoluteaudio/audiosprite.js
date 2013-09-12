/**
 * Created by craig on 9/10/13.
 */
define(function () {

    var currentClip = null;

    var AudioSprite = function (baseClip, start, end) {
        this.init(baseClip, start, end);
    };

    AudioSprite.constructor = AudioSprite;

    AudioSprite.prototype.init = function (baseClip, start, end) {
        this.baseClip = baseClip;
        this.start = start;
        this.end = end;
        this.cancelled = false;
    };

    AudioSprite.prototype.seek = function (offset) {
        this.baseClip.seek(this.offset + offset);
    };

    AudioSprite.prototype.play = function (delay, loop, onComplete) {
        var _delay = delay || 0;

        if (this.muted) {
            return;
        }

        var doPlay = function () {
            console.log('audio sprite: seek to ' + this.start);
            this.baseClip.audioElement.currentTime = this.start;
            console.log('audio sprite: play');
            if (this !== currentClip) {
                if (currentClip) {
                    currentClip.cancelled = true;
                }
                currentClip = this;
                this.cancelled = false;
            }
            this.baseClip.audioElement.play();
            requestAnimationFrame(checkComplete);
        }.bind(this);

        var checkComplete = function() {
            if (this.cancelled) {
                console.log('cancelled');
                return;
            }

            if (this.baseClip.audioElement.currentTime >= this.end) {
                this.paused = false;
                if (loop) {
                    doPlay();
                }
                else {
                    this.paused = true;
                    this.baseClip.audioElement.pause();
                    if (onComplete && typeof onComplete === 'function') {
                        onComplete();
                    }
                    console.log('audio sprite: stop at ' + this.end);
                }
            }
            else if (!this.baseClip.audioElement.paused) {
                requestAnimationFrame(checkComplete);
            }
        }.bind(this);

        if (_delay > 0) {
            setTimeout(function () {
                doPlay();
            }.bind(this), _delay * 1000);
        }
        else {
            doPlay();
        }
    };

    AudioSprite.prototype.pause = function () {
        this.baseClip.pause();
    };

    AudioSprite.prototype.stop = function () {
        this.baseClip.stop();
    };

    AudioSprite.prototype.setVolume = function (volume) {
        this.baseClip.setVolume();
    };

    AudioSprite.prototype.getVolume = function () {
        return this.baseClip.getVolume();
    };

    AudioSprite.prototype.mute = function () {
        this.muted = true;
        this.cancelled = true;
        this.baseClip.audioElement.pause();
    };

    AudioSprite.prototype.unmute = function () {
        this.muted = false;
    };

    AudioSprite.prototype.isMuted = function () {
        return this.baseClip.isMuted();
    };

    AudioSprite.prototype.prime = function () {
        this.baseClip.prime();
    };

    return AudioSprite;

});