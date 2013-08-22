/**
 * User: craig
 * Date: 7/18/13
 * Time: 9:54 PM
 */
define(function () {

    var muteBroken = navigator.userAgent.indexOf('iPhone OS') >= 0;

    var AudioClip = function (url, onReady) {
        this.init(url, onReady);
    };

    AudioClip.constructor = AudioClip;

    AudioClip.prototype.init = function (url, onReady) {

    };

    AudioClip.prototype.load = function (url, onReady) {

    };

    AudioClip.prototype.play = function (delay, loop, onComplete) {

    };

    AudioClip.prototype.pause = function () {

    };

    AudioClip.prototype.stop = function () {

    };

    AudioClip.prototype.setVolume = function (volume) {

    };

    AudioClip.prototype.getVolume = function () {

    };

    AudioClip.prototype.mute = function () {

    };

    AudioClip.prototype.unmute = function () {

    };

    AudioClip.prototype.isMuted = function () {

    };

    AudioClip.prototype.prime = function () {

    };

    return AudioClip;

});