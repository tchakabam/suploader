#SupLoader

Simple client side encoding & uploading of MP3s from any supported audio format!

Decodes an audio file (from any local file or remote URL supported by XHR) using the available WebAudio implementation, encodes it to MP3 using LAME.js and posts it to an HTTP endpoint of your choice.

Uses MP3 encoder from https://github.com/zhuker/lamejs

:warning: This is rather a proof of concept than anything else you should try to use in prod!

# Run demo

```
npm install
npm run demo
```

Go to `localhost:3000`, choose a file (for example WAV) to transcode.

Check server output log. When upload done, go to the `upload` directory in the project root and find the MP3 output.

# API

    var Supload = require('supload');

    Supload.transcodeFromUrl(someUrl, Supload.newConfig());

    // see config for advanced usage