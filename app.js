const express = require('express')
const fileUpload = require('express-fileupload');
const cron = require('node-cron');
const contentDisposition = require('content-disposition');
const finalhandler = require('finalhandler');
const app = express()
var path = require('path');
const port = 3000

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});
// list converted books directory
var serveIndex = require('serve-index');
app.use('/books', serveIndex(__dirname + '/books'));

app.get('/books/**', function (req, res, next) {
  // file name
  var fileName = req.params[0];
  var filePath = path.resolve('./books/'+fileName); // Or format the path using the `id` rest param
  res.download(path.resolve(filePath));
});

app.use(fileUpload());

app.post('/upload', function(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
  let filename = req.files.sampleFile.name;
  console.log(filename);

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('convertMe/'+filename, function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });
});


// run the conversion, put it in the right folder
cron.schedule('* * * * *', function() {
  console.log('looking for books to convert');

const { exec } = require("child_process");

exec(path.join(__dirname + "/convert.sh"), (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
