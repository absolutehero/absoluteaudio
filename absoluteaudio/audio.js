/**
 * User: craig
 * Date: 7/18/13
 * Time: 9:35 PM
 */
define(['absoluteaudio/webaudioclip', 'absoluteaudio/streamedwebaudioclip', 'absoluteaudio/html5audioelementclip'],
    function (WebAudioClip, StreamedWebAudioClip, HTML5AudioClip) {
    "use strict";

    var audioContext = null;

    if (typeof AudioContext !== 'undefined') {
        audioContext = new AudioContext();
    } else if (typeof webkitAudioContext !== 'undefined') {
        audioContext = new webkitAudioContext();
    }

        //audioContext = null;

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
            else {
                return new HTML5AudioClip(url, onLoaded, duration);
            }
        },

        usingWebAudio: function () {
            return audioContext !== null;
        }
    };

    return AbsoluteAudio;
});