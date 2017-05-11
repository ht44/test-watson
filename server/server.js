'use strict';
const express = require('express');
const VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const pg = require('pg');
const posts = require('./controllers/routers/posts');
const logger = require('morgan');
const fs = require('fs');
const app = module.exports = express();
require('dotenv').config();

// Config
app.set('view engine', 'pug');

// Built-in Middleware
app.use('/static', express.static(path.join(__dirname, 'client')));

// Module Middleware
app.use(logger('common'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// Router Middleware
app.use('/posts', posts);

// Watson
var visual_recognition = new VisualRecognitionV3({
  api_key: process.env.API_KEY,
  version_date: VisualRecognitionV3.VERSION_DATE_2016_05_20
});

// Image for Watson
var params = {
  images_file: fs.createReadStream('client/images/IMG_0115.JPG')
};

// Root
app.get('/', (req, res) => {
  visual_recognition.classify(params, function(err, res) {
  if (err)
    console.log(err);
  else
    console.log(JSON.stringify(res, null, 2));
  });
  res.send('check your terminal bra');
});

if (!module.parent) {
  app.listen(8000);
  console.log('Express started on port 8000');
}
