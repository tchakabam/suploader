var express         =  require("express");
var multer          =  require('multer');
var app             =  express();
var upload          =  multer({ dest: './uploads/'});

app.use(multer({ dest: './uploads/',
    rename: function (fieldname, filename) {
        return filename + Date.now();
    },
    onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...');
    },
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path)
    }
}));

function serveStaticAssetFromLocalPath(path) {
    app.get(path, function(req, res) {
          res.sendFile(__dirname + path);
    });
}

serveStaticAssetFromLocalPath('/index.html');
serveStaticAssetFromLocalPath('/demo.js');
serveStaticAssetFromLocalPath('/lib.js');
serveStaticAssetFromLocalPath('/worker.js');

app.get('/', function(req, res) {
      res.sendFile(__dirname + "/demo.html");
});

app.post('/upload', function(req, res) {
    upload(req, res, function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
        console.log(req.file);
        console.log('File uploaded');
    });
});

app.listen(3000, function() {
    console.log("Working on port 3000");
});

