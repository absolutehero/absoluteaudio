/**
 * User: craig
 * Date: 7/18/13
 * Time: 9:54 PM
 */
define(['absoluteaudio/audioclip','absolute/debug'], function (AudioClip, Debug) {

    var muteBroken = navigator.userAgent.indexOf('iPhone OS') >= 0;

    var WebAudioClip = function (url, onReady, audioContext) {
        this.init(url, onReady, audioContext);
    };

    WebAudioClip.constructor = WebAudioClip;
    WebAudioClip.prototype = Object.create(AudioClip.prototype);

    WebAudioClip.prototype.init = function (url, onReady, audioContext) {
        AudioClip.prototype.init.call(url, onReady);

        this.audioContext = audioContext;
        this.url = url;
        this.volume = 1;
        this.offset = 0;
        this.sourceNode = null;
        this.gainNode = null;
        this.muted = false;

        this.load(url, onReady);
    };

    WebAudioClip.prototype.load = function (url, onReady) {
        var soundRequest = new XMLHttpRequest();

        soundRequest.open('GET', url, true);
        soundRequest.responseType = 'arraybuffer';

        soundRequest.onload = function () {
            this.audioContext.decodeAudioData(soundRequest.response,
                function (buffer) {
                    this.buffer = buffer;
                    if (onReady && typeof onReady === 'function') {
                        onReady();
                    }
                }.bind(this),
                function () {
                    Debug.log('error loading audio clip ' + url);
                    if (onReady && typeof onReady === 'function') {
                        onReady();
                    }
                }.bind(this)
            );
        }.bind(this);

        soundRequest.send();
    };

    WebAudioClip.prototype.play = function (delay, loop, onComplete) {
        var when = (delay || 0);
        this.loop = !!loop;
        this.onComplete = onComplete;

        if (muteBroken && this.muted) {
            return;
        }

        this.sourceNode = this.audioContext.createBufferSource();
        if (typeof this.audioContext.createGainNode !== "undefined") {
            this.gainNode = this.audioContext.createGainNode();
        }
        else {
            this.gainNode = this.audioContext.createGain();
        }

        try {
            this.sourceNode.loop = loop;
            this.sourceNode.buffer = this.buffer;
            this.sourceNode.onended = function () {
                if (onComplete && typeof onComplete === 'function') {
                    onComplete();
                }
            };

            this.gainNode.gain.value = this.muted ? 0 : this.volume;

            this.sourceNode.connect(this.gainNode);
            this.gainNode.connect(this.audioContext.destination);

            if (when !== 0) {
                when += this.audioContext.currentTime;
            }

            if (typeof this.sourceNode.start === 'undefined') {
                this.sourceNode.noteOn(when);
            }
            else {
                this.sourceNode.start(when, this.offset);
            }
        }
        catch (e) {
            if (typeof Raygun !== 'undefined') {
                Raygun.send(e);
            }
        }
    };

    WebAudioClip.prototype.pause = function () {
        this.stop();
        this.offset = this.audioContext.currentTime;
    };

    WebAudioClip.prototype.stop = function () {
        if (this.sourceNode) {
            this.offset = 0;
            if (typeof this.sourceNode.start === 'undefined') {
                this.sourceNode.noteOff(0);
            }
            else {
                this.sourceNode.stop(0);
            }
            this.sourceNode = null;
            this.gainNode = null;
        }
    };

    WebAudioClip.prototype.setVolume = function (volume) {
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

    WebAudioClip.prototype.getVolume = function () {
        return this.volume;
    };

    WebAudioClip.prototype.mute = function () {
        this.muted = true;
        if (this.gainNode) {
            this.gainNode.gain.value = 0;
            if (muteBroken) {   // workaround for mute on iOS Safari
                this.pause();
            }
        }
    };

    WebAudioClip.prototype.unmute = function () {
        this.muted = false;
        if (this.gainNode) {
            this.gainNode.gain.value = this.volume;
            if (muteBroken) {   // workaround for mute on iOS Safari
                this.play(0, this.loop, this.onComplete);
            }
        }
    };

    WebAudioClip.prototype.isMuted = function () {
        return this.muted;
    };

    return WebAudioClip;

});