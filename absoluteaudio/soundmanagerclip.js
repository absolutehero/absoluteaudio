/**
 * User: craig
 * Date: 8/11/14
 * Time: 12:48 PM
 * Copyright (c) 2014 Absolute Hero, Inc.
 */
define(['soundmanager2'], function (soundManager) {

    var SoundManagerClip = function (url, onReady) {
        this.init(url, onReady);
    };

    SoundManagerClip.constructor = SoundManagerClip;

    SoundManagerClip.prototype.init = function (url, onReady) {

        this.load(url, onReady);
    };

    SoundManagerClip.prototype.load = function (url, onReady) {
        var id = url.substring(url.lastIndexOf('/') + 1);

        this.sound = soundManager.createSound({
            id: id,
            url: '/' + url,
            autoLoad: true,
            onload: function() {
                onReady();
            }
            // other options here..
        });
    };

    SoundManagerClip.prototype.seek = function (offset) {

    };

    SoundManagerClip.prototype.play = function (delay, loop, onComplete) {
        var _loop = !!loop;

        var _playAgain = function () {
            if (_loop) {
                this.sound.play({
                    "onfinish": function () {
                        _playAgain()
                    }
                });
            }
            else {
                if (onComplete && typeof onComplete == 'function') {
                    onComplete();
                }
            }
        }.bind(this);

        this.sound.play({"onfinish": function() { _playAgain() }});
    };

    SoundManagerClip.prototype.pause = function () {
        this.sound.stop();
    };

    SoundManagerClip.prototype.stop = function () {
        this.sound.stop();
    };

    SoundManagerClip.prototype.setVolume = function (volume) {

    };

    SoundManagerClip.prototype.getVolume = function () {

    };

    SoundManagerClip.prototype.mute = function () {
        this.sound.mute();
    };

    SoundManagerClip.prototype.unmute = function () {
        this.sound.unmute();
    };

    SoundManagerClip.prototype.isMuted = function () {
        return this.muted;
    };

    SoundManagerClip.prototype.prime = function () {

    };

    return SoundManagerClip;

});