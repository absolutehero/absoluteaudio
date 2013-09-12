/**
 * User: craig
 * Date: 7/18/13
 * Time: 9:35 PM
 */
define(['absoluteaudio/webaudioclip', 'absoluteaudio/streamedwebaudioclip', 'absoluteaudio/html5audioelementclip', 'absoluteaudio/audiosprite'],
    function (WebAudioClip, StreamedWebAudioClip, HTML5AudioClip, AudioSprite) {
    "use strict";

    var audioContext = null;

    if (typeof AudioContext !== 'undefined') {
        audioContext = new AudioContext();
    } else if (typeof webkitAudioContext !== 'undefined') {
        audioContext = new webkitAudioContext();
    }

    //audioContext = null;

    var AbsoluteAudio =  {
        createAudioClip: function (url, onLoaded, stream, duration, sprite) {
            if (audioContext !== null) {

                if (!!stream) {
                    return new StreamedWebAudioClip(url, onLoaded, audioContext);
                }
                else {
                    return new WebAudioClip(url, onLoaded, audioContext);
                }
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
        }
    };

    return AbsoluteAudio;
});