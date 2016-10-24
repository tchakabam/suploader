#SupLoader

Simple MP3 client side encoding & uploading

Decodes an audio file (from any URL) using XHR, the available WebAudio API, encodes it to MP3 and posts it to an HTTP endpoint.

Uses MP3 encoder from https://github.com/zhuker/lamejs

#Usage

    var Supload = require('supload');

    Supload.transcodeFromUrl(someUrl, Supload.newConfig());

    // see config for advanced usage