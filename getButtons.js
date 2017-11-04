var credentials = require('./credentials.json');

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

var useDB = function(db){
    var sql  = "use "+db+";";
    return query(mysql.format(sql));
}

var selectButtonRecord = function(){
    var sql  = "select * from till_buttons;"
    return query(mysql.format(sql));
}

var receivedRecords = function(db) {
    return receiveRecords = useDB(db)
    .then(selectButtonRecord)
}

exports.receivedRecords = receivedRecords;
exports.releaseButtons = endPool;
