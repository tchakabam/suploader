var progress = document.getElementById('progress');
var audioFile = document.getElementById('audioFile');

audioFile.onchange = onFileChange;

function onFileChange() {

    var files = this.files;
    var fileUrl = URL.createObjectURL(files[0]);

 	transcodeFromUrl(fileUrl, {
 		onDecoded: function(buffer) {
 			window.console.log('decoded samples: ' + buffer.length);
			document.querySelector('#decoded').innerHTML = 'Decoded: ' + buffer.length + ' raw samples';
			document.querySelector('#duration').innerHTML = 'Audio file duration: ' + buffer.duration + ' seconds';
 		},
 		onPreprocessProgress: function(ratio) {
 			console.log('PREPROCESS: %d percent of raw audio samples pre-processed', ratio * 100);
			progress.value = ratio * progress.max;
 		},
 		onProgress: function(bytes, total) {
			console.log('PROGRESS: %d of %d bytes encoded', bytes, total);
			progress.value = (bytes / total) * progress.max;
			document.querySelector('#encoded').innerHTML = 'Encoded: ' + bytes + ' of ' + total + ' estimated bytes';
 		},
 		onTranscoded: function(blob) {
			console.log('bytes: ' + blob.size);
 		},
 		onUploaded: function(event) {
	  		console.log('data uploaded');
 		},
 		onError: function(event) {

 		},
 		workerUrl: 'worker.js',
 		bitrateKbps: 128,
 		sampleRate: 44100,
 		uploadUrl: "http://localhost:3000/upload"
 	});
}

