/**
 * The main module that defines the public interface for absoluteaudio.
 */
define(function (require) {
    'use strict';

    //Return the module value.
    return {
        version: '1.0',
        context: require('absoluteaudio/audio')
    };
});
