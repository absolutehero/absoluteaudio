/**
 * User: craig
 * Date: 7/18/13
 * Time: 9:54 PM
 */
define(function () {

    var muteBroken = navigator.userAgent.indexOf('iPhone OS') >= 0;

    var StreamedWebAudioClip = function (url, onReady, audioContext) {
        this.init(url, onReady, audioContext);
    };

    StreamedWebAudioClip.prototype.init = function (url, onReady, audioContext) {
        this.audioContext = audioContext;
        this.url = url;
        this.volume = 1;
        this.offset = 0;
        this.audioElement = null;
        this.source = null;
        this.gainNode = null;
        this.muted = false;

        this.load(url, onReady);
    };

    StreamedWebAudioClip.prototype.load = function (url, onReady) {
        this.audioElement = new Audio();
        this.audioElement.addEventListener("loadstart", function () {
            if (onReady && typeof onReady === 'function') {
                onReady();
            }
        }, false);

        this.audioElement.src = this.url;
    };

    StreamedWebAudioClip.prototype.play = function (delay, loop, onComplete) {
        this.audioElement.loop = loop;

        if (!this.source) {
            this.source = this.audioContext.createMediaElementSource(this.audioElement);
            this.gainNode = this.audioContext.createGainNode();

            this.source.connect(this.gainNode);
            this.gainNode.connect(this.audioContext.destination);
            this.gainNode.gain.value = this.muted ? 0 : this.volume;
        }

        this.audioElement.addEventListener("ended", function () {
            if (onComplete && typeof onComplete === 'function') {
                onComplete();
            }
        }, false);

        this.audioElement.play();
    };

    StreamedWebAudioClip.prototype.pause = function () {
        if (this.audioElement) {
            this.audioElement.pause();
        }
    };

    StreamedWebAudioClip.prototype.stop = function () {
        if (this.audioElement) {
            this.audioElement.pause();
        }
    };

    StreamedWebAudioClip.prototype.setVolume = function (volume) {
        if (volume < 0) {
            volume = 0;
        }
        else if (volume > 1) {
            volume = 1;
        }

        this.volume = volume;
        if (this.gainNode) {
            this.gainNode.gain.value = volume;
        }
    };

    StreamedWebAudioClip.prototype.getVolume = function () {
        return this.volume;
    };

    StreamedWebAudioClip.prototype.mute = function () {
        this.muted = true;
        if (this.gainNode) {
            this.gainNode.gain.value = 0;
            if (muteBroken) {   // workaround for mute on iOS Safari
                //this.pause();
            }
        }
    };

    StreamedWebAudioClip.prototype.unmute = function () {
        if (this.gainNode) {
            if (muteBroken) {   // workaround for mute on iOS Safari
                //this.play(this.loop, this.onComplete);
            }
            this.gainNode.gain.value = this.volume;
        }
        this.muted = false;
    };

    StreamedWebAudioClip.prototype.isMuted = function () {
        return this.muted;
    };

    return StreamedWebAudioClip;

});