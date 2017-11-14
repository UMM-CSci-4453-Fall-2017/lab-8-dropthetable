var myArgs = process.argv.slice(2);

var commandInput = myArgs[0];

GetButtons=require('./getButtons.js');
var express=require('express'),
mysql=require('mysql'),

app = express(),
port = process.env.PORT || 1337;

var buttons;

app.use(express.static(__dirname + '/public'));

GetButtons.receivedButtons(commandInput)
.then(function(result){buttons = result});


app.get("/buttons",function(req,res){ // handles the /buttons API
  res.send(buttons);
});

app.get("/click",function(req,res){
  var id = req.param('id');
  GetButtons.click(id, commandInput)
  .then(function(){
       res.send();
     });
});

app.get("/transactions", function(req, res){
  GetButtons.getTotalPrice(commandInput)
  .then(function(result){
    console.log(result);
    res.send(result);
  });
});

app.get("/deleteItem", function(req, res) {
  var id = req.param('id');
  console.log("ID: " + id);
  GetButtons.deleteRow(commandInput, id)
  .then(function() {
    res.send();
  });
});

// Your other API handlers go here!

app.listen(port);
