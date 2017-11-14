var credentials=require('./credentials.json');

var mysql=require("mysql");
var Promise = require('bluebird');

var using = Promise.using;

Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

credentials.host="ids"
var connection = mysql.createConnection(credentials);
var pool=mysql.createPool(credentials);

var getConnection=function(){
  return pool.getConnectionAsync().disposer(
    function(connection){return connection.release();}
  );
};

var query=function(command){ //SQL comes in and a promise comes out.
  return using(getConnection(),function(connection){
    return connection.queryAsync(command);
  });
};

var endPool=function(){
  console.log("End Connection to DB");
  pool.end(function(err){});
}


var selectButtonRecord = function(db){
  var sql  = "select * from "+db+".till_buttons;"
  console.log(sql);
  return query(mysql.format(sql));
}

var receivedButtons = function(db) {
  return receiveRecords = selectButtonRecord(db);
}


var checkSupply = function(itemID, db){
  var sql = "select * from "+db+".supply where itemID = "+itemID+";";
  console.log(sql);
  var recordsExists = false;
  var price;
  return query(mysql.format(sql))
  .then(function(result){
    if(result.length > 0){
      price = result[0].price;
      recordsExists = true;
      //checkTransaction(itemID, price, db);
    }else{
      console.log("No item in supply with itemID "+itemID);
    }
  })
  .then(function() {
    if(recordsExists) {
      checkTransaction(itemID, price, db);
    }else{
      console.log("No item in supply with itemID "+itemID);
    }
  });
}


var checkTransaction = function(itemID, price, db){
  //var sql = "select * from "+db+".transactions where itemID = "+itemID+";";
  var sql = "INSERT INTO " + db + ".transactions VALUES (" + itemID + ", " + 1 + ", " + price + ") ON DUPLICATE KEY UPDATE totalPrice = (quantity + 1)* " + price + " , quantity  = quantity+1;";
  query(mysql.format(sql));
}


var getTotalPrice = function(db){
  var sql = "select itemID, (select itemName from "+db+".supply where "+db+".supply.itemID = "+db+".transactions.itemID) as itemName, quantity, totalPrice from "+db+".transactions;";
  return query(mysql.format(sql));
}

var deleteRow = function(db, id) {
  var sql = 'DELETE FROM ' + db + '.transactions WHERE itemID = ' + id + ';';
  console.log(sql);
  return query(mysql.format(sql));
}


exports.receivedButtons = receivedButtons;
exports.releaseButtons = endPool;
exports.click = checkSupply;
exports.getTotalPrice = getTotalPrice;
exports.deleteRow = deleteRow;
