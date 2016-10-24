var context = new AudioContext();

function uploadBlob(blob, filename, config) {
	var formData = new FormData();
	formData.append('file', blob, filename);

	var oReq = new XMLHttpRequest();
	oReq.open("POST", config.uploadUrl, true);
	oReq.onload = function (event) {
	  config.onUploaded(event);
	};
	oReq.send(formData);
}

// FIXME: check for mono/stereo channel modes
function encodeRawSourceBuffer(buffer, config) {

	var worker = new Worker(config.workerUrl || 'worker.js');
	var bitrateKbps = config.bitrateKbps || 128;
	var sampleRate = config.sampleRate || 44100;
	var estimatedOutputLength = Math.round(buffer.duration * ((bitrateKbps*1000)/8));

	worker.onmessage = function(e) {
		if (e.data[0] === 'preprocess-progress') {
			config.onPreprocessProgress(e.data[1] / 100);
		}
		if (e.data[0] === 'progress') {
			config.onProgress(e.data[1], estimatedOutputLength);
		}
		if (e.data[0] === 'done') {
			var blob = new Blob(e.data[1], {type: 'audio/mpeg'});
			config.onTranscoded(blob);
			if (config.uploadUrl) {
				uploadBlob(blob, 'upload.mp3', config);
			}
		}
	};
	worker.postMessage([buffer.getChannelData(0), buffer.getChannelData(1), sampleRate, bitrateKbps]);
}

/*
* @return Blob with transcoded file
*/
function transcodeFromUrl(url, config) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function () {
        context.decodeAudioData(request.response, function (buffer) {
        	config.onDecoded(buffer);
            encodeRawSourceBuffer(buffer, config);
        }, config.onError);
    }
    request.send();
}

function newConfig() {
    return {
        onDecoded: function(buffer) {},
        onPreprocessProgress: function(ratio) {},
        onProgress: function(bytes, total) {},
        onTranscoded: function(blob) {},
        onUploaded: function(event) {},
        onError: function(event) {},
        workerUrl: 'worker.js',
        bitrateKbps: 128,
        sampleRate: 44100,
        uploadUrl: "http://localhost:3000/upload"
    };
}

module.exports = {
	transcodeFromUrl: transcodeFromUrl,
	encodeRawSourceBuffer: encodeRawSourceBuffer,
	uploadBlob: uploadBlob,
	newConfig: newConfig
};