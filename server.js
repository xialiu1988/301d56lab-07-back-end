'use strict';
const express=require('express');
const cors=require('cors');
require('dotenv').config();

const superagent=require('superagent');
const PORT=process.env.PORT||3000;
const app=express();

app.use(cors());

app.use(express.static('./'));


app.get('/location',(req,res)=>{
  try{
   const queryData=req.query.data;
   let geoUrl=`https://maps.googleapis.com/maps/api/geocode/json?address=${queryData}&key=${process.env.GEOCODE_API_KEY}`;
    superagent.get(geoUrl)
    .end((err,apiResponse)=>{
const location=new Location(queryData,apiResponse.body);
res.send(location);
    }); 
  }
  catch(error){
    handleError(error);
  }
});


//location constructor
function Location(query,data){
  this.search_query=query;
  this.formatted_query=data.results[0].formatted_address;
  this.latitude=data.results[0].geometry.location.lat;
  this.longitude=data.results[0].geometry.location.lng;
}


app.get('/weather',(request,response)=>{
  try{
    console.log(request.query.data.latitude);
    const weatherUrl=`https://api.darksky.net/forecast/${process.env.DARKSKY_KEY}/${request.query.data.latitude},${request.query.data.longitude}`;
  superagent.get(weatherUrl)
  .then(result=>{
    const weatherSummaries=result.body.daily.data.map(el=>{
    return new Weather(el);
    });
    response.send(weatherSummaries);
  })
  }
  catch(error){handleError(error,response);}
});



function Weather(demo){
  this.time=new Date(demo.time*1000).toDateString();
  this.forecast=demo.summary;
}



//error handling
function handleError(error,res){
  res.status(500).send('error');
}
app.listen(PORT,()=>{});
