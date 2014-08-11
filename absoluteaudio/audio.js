/**
 * User: craig
 * Date: 7/18/13
 * Time: 9:35 PM
 */
define(['absoluteaudio/webaudioclip', 'absoluteaudio/streamedwebaudioclip', 'absoluteaudio/html5audioelementclip',
        'absoluteaudio/audiosprite', 'absoluteaudio/cordovaclip', 'absoluteaudio/soundmanagerclip', 'absoluteaudio/debug'],
    function (WebAudioClip, StreamedWebAudioClip, HTML5AudioClip, AudioSprite, CordovaClip, SoundManagerClip, Debug) {
    "use strict";

    var audioContext = null;

    if (typeof AudioContext !== 'undefined') {
        audioContext = new AudioContext();
    } else if (typeof webkitAudioContext !== 'undefined') {
        audioContext = new webkitAudioContext();
    } else if (typeof mozAudioContext !== 'undefined') {
        audioContext = new mozAudioContext();
    }

    if(Debug.enabled) {
        audioContext = null;
    }


    var AbsoluteAudio =  {
        createAudioClip: function (url, onLoaded, stream, duration) {
            if (audioContext !== null) {

                if (!!stream) {
                    return new StreamedWebAudioClip(url, onLoaded, audioContext);
                }
                else {
                    return new WebAudioClip(url, onLoaded, audioContext);
                }
            }
            else if (navigator.userAgent.indexOf("Trident") >= 0 || navigator.userAgent.indexOf("MSIE") >= 0) {
                return new SoundManagerClip(url, onLoaded);
            }
            else if (typeof Media !== 'undefined') {
                return new CordovaClip(url, onLoaded);
            }
            else {
                return new HTML5AudioClip(url, onLoaded, duration);
            }
        },

        createAudioSprite: function (baseClip, start, end) {
            return new AudioSprite(baseClip, start, end);
        },

        usingWebAudio: function () {
            return audioContext !== null;
        },

        usingCordovaAudio: function () {
            return typeof Media !== 'undefined';
        },

        usingSoundManagerAudio: function () {
            return typeof soundManager !== 'undefined';
        }
    };

    return AbsoluteAudio;
});