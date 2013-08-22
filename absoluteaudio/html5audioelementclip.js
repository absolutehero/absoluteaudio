/**
 * User: craig
 * Date: 7/18/13
 * Time: 9:54 PM
 */
define(['absoluteaudio/audioclip'], function (AudioClip) {

    var muteBroken = true;

    var HTML5AudioClip = function (url, onReady, duration) {
        this.init(url, onReady, duration);
    };

    HTML5AudioClip.constructor = HTML5AudioClip;
    HTML5AudioClip.prototype = Object.create(AudioClip.prototype);

    HTML5AudioClip.prototype.init = function (url, onReady, duration) {
        AudioClip.prototype.init.call(url, onReady);

        this.duration = duration;
        this.url = url;
        this.volume = 1;
        this.audioElement = null;
        this.muted = false;
        this.loopTimer = null;
        this.delay = 0;
        this.loop = false;
        this.onComplete = null;
        this.paused = true;

        this.load(url, onReady);
    };

    HTML5AudioClip.prototype.load = function (url, onReady) {
        this.audioElement = new Audio();
        this.audioElement.addEventListener("loadstart", function () {
            if (onReady && typeof onReady === 'function') {
                onReady();
            }
        }.bind(this), false);

        this.audioElement.src = this.url;
    };

    HTML5AudioClip.prototype.play = function (delay, loop, onComplete) {

        try {
            this.delay = delay;
            this.loop = loop;
            this.onComplete = onComplete;

            //this.audioElement.loop = loop;

            if (this.muted && muteBroken) {
                if (loop) {
                    this.paused = false;
                }
                return;
            }

            if (typeof this.duration !== 'undefined') {

                var checkComplete = function() {
                    if (this.audioElement.currentTime >= this.duration) {
                        this.paused = false;
                        if (loop) {
                            this.audioElement.pause();
                            this.audioElement.currentTime = 0;
                            this.play(delay, loop, onComplete);
                        }
                        else {
                            this.paused = true;
                            this.audioElement.pause();
                            if (onComplete && typeof onComplete === 'function') {
                                onComplete();
                            }
                        }
                    }
                    else if (!this.audioElement.paused) {
                        requestAnimationFrame(checkComplete);
                    }
                }.bind(this);

                requestAnimationFrame(checkComplete);
            }

            this.audioElement.currentTime = 0;
            this.audioElement.play();

        }
        catch (e) {}
    };

    HTML5AudioClip.prototype.pause = function () {
        this._actualPause();
        this.paused = true;
    };

    HTML5AudioClip.prototype._actualPause = function () {
        if (this.audioElement) {
            if (this.loopTimer) {
                clearTimeout(this.loopTimer);
                this.loopTimer = null;
            }
            this.audioElement.pause();
        }
    };

    HTML5AudioClip.prototype.stop = function () {
        try {
            if (this.audioElement) {
                if (this.loopTimer) {
                    clearTimeout(this.loopTimer);
                    this.loopTimer = null;
                }
                this.audioElement.pause();
                this.audioElement.currentTime = 0;
            }
        }
        catch (e) {}
    };

    HTML5AudioClip.prototype.setVolume = function (volume) {
        if (volume < 0) {
            volume = 0;
        }
        else if (volume > 1) {
            volume = 1;
        }

        this.volume = volume;
        if (this.audioElement) {
            this.audioElement = volume;
        }
    };

    HTML5AudioClip.prototype.getVolume = function () {
        return this.volume;
    };

    HTML5AudioClip.prototype.mute = function () {
        this.muted = true;
        if (this.audioElement) {
            this.audioElement.volume = 0;
            if (muteBroken && !this.paused) {   // workaround for mute on iOS Safari
                this._actualPause();
            }
        }
    };

    HTML5AudioClip.prototype.unmute = function () {

        if (this.audioElement) {
            if (this.muted && muteBroken && !this.paused) {   // workaround for mute on iOS Safari
                this.muted = false;
                this.play(this.delay, this.loop, this.onComplete);
            }
            this.audioElement.volume = this.volume;
        }
        this.muted = false;
    };

    HTML5AudioClip.prototype.isMuted = function () {
        return this.muted;
    };


    HTML5AudioClip.prototype.prime = function () {
        if (this.audioElement) {
            this.audioElement.play();
            this.audioElement.pause();
        }
    };


    return HTML5AudioClip;

});