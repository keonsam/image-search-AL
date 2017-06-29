"use strict";
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Bing = require('node-bing-api')({accKey: '98ea8c79bc684684b33c6b4a51252017'});
const recentSearch = require('./models/recentSearches')

mongoose.connect(process.env.MONGO_URI || 'mongodb://recentSearch:recentSearch@ds141082.mlab.com:41082/recentsearch');

const VIEWS = path.join(__dirname, 'public');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(VIEWS));

app.get('/api/imagesearch/:searchQuery',(req,res) =>{
 const searchQuery = req.params.searchQuery;
 const offset = req.query.offset;
 const top = offset +10;
 const skip = offset 
 const data = new recentSearch({
   searchQuery,
   when: new Date()
 });

 data.save(err =>{
  if(err) res.send('Error Saving to Database');
});

Bing.images(searchQuery,{
  top,
  skip
},(error,ress, body)=>{
  if(error) return res.send('Error finding search result. Please fix the url');
  const Json = [];
  for(let i=0;i<10;i++){
    Json.push({
      name: body.value[i].name,
      weburl: body.value[i].webSearchUrl,
      thumbnailUrl: body.value[i].thumbnailUrl,
      webpage: body.value[i].hostPageDisplayUrl
    });
  }
  res.json(Json);
});

});

app.get('/api/imagesearch',(req, res)=>{
  recentSearch.find({},(err, data)=>{
    if(err) return res.send("Error finding Database");
    res.send(data);
  });
});

app.listen(process.env.PORT || 3000, ()=>{
  console.log('server is working');
})
