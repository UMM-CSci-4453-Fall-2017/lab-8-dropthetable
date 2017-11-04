var myArgs = process.argv.slice(2);

var commandInput = myArgs[0];

GetButtons=require('./getButtons.js');
var express=require('express'),
mysql=require('mysql'),
credentials=require('./credentials.json'),
app = express(),
port = process.env.PORT || 1337;


var buttons;

app.use(express.static(__dirname + '/public'));

GetButtons.receivedRecords(commandInput)
.then(function(result){buttons = result})
.then(GetButtons.releaseButtons)
.then(function(){console.log("Starting server")});

app.get("/buttons",function(req,res){ // handles the /buttons API
  res.send(buttons);
});

app.get("/click",function(req,res){
  var id = req.param('id');
  var sql = 'YOUR SQL HERE'
  console.log("Attempting sql ->"+sql+"<-");

  connection.query(sql,(function(res){return function(err,rows,fields){
     if(err){console.log("We have an insertion error:");
             console.log(err);}
     res.send(err); // Let the upstream guy know how it went
  }})(res));
});
// Your other API handlers go here!

app.listen(port);
