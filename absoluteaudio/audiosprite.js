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
        this.muted = false;
        this.paused = true;
    };

    AudioSprite.prototype.seek = function (offset) {
        this.baseClip.seek(this.offset + offset);
    };

    AudioSprite.prototype.play = function (delay, loop, onComplete) {
        this.delay = delay;
        this.loop = loop;
        this.onComplete = onComplete;
        var _delay = delay || 0;

        if (this.muted) {
            return;
        }

        var doPlay = function () {

            try {
                this.baseClip.audioElement.pause();
                this.paused = true;


                this.baseClip.audioElement.currentTime = this.start;

                var checkTime = function () {
                    this.baseClip.audioElement.currentTime = this.start;

                    if (this.baseClip.audioElement.currentTime !== this.start) {
                        setTimeout(checkTime, 100);
                    }
                    else {

                        if (this !== currentClip) {
                            if (currentClip) {
                                currentClip.cancelled = true;
                            }
                            currentClip = this;
                            this.cancelled = false;
                        }
                        this.paused = false;
                        this.baseClip.audioElement.play();
                        requestAnimationFrame(checkComplete);
                    }

                }.bind(this);

                checkTime();

            }
            catch (e) {
                //    alert('AudioSprite: audioElement.currentTime '  + e);
            }


            //setTimeout(checkComplete, 10);
        }.bind(this);

        var checkComplete = function() {
            if (this.cancelled) {

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
                }
            }
            else if (!this.paused) {
                requestAnimationFrame(checkComplete);
                //setTimeout(checkComplete, 10);
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

        if (!this.paused && !this.cancelled) {
            this.baseClip.audioElement.pause();
        }
        this.muted = true;
        this.cancelled = true;
    };

    AudioSprite.prototype.unmute = function () {
        this.muted = false;
        if (!this.paused) {
            this.play(this.delay, this.loop, this.onComplete);
        }
    };

    AudioSprite.prototype.isMuted = function () {
        return this.baseClip.isMuted();
    };

    AudioSprite.prototype.prime = function () {
        //this.baseClip.prime();
    };

    return AudioSprite;

});