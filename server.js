var express=require('express');
var app=express();

app.use(express.static(__dirname));
app.use(express.static(__dirname+'/stamplay-js-sdk-master/'));
app.get('/',function(req,res){
res.sendFile(__dirname+'/index.html');

})
app.get('/w',function(req,res){res.sendFile(__dirname+'/weather.html');});
app.get('/s',function(req,res){
  res.sendFile(__dirname+'/stamplay.html');
});
app.get('/reset',function(req,res){

  res.sendFile(__dirname+'/reset.html');
});
app.get('/trail',function(req,res) {res.sendFile(__dirname+'/trailpage.html');

})
app.listen(8000);
