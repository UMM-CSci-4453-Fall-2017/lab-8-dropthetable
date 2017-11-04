var myArgs = process.argv.slice(2);

var db = myArgs[0];

var credentials = require('./credentials.json');

var mysql=require("mysql");

credentials.host="ids";

var connection = mysql.createConnection(credentials);

useDB(db);

function useDB(db) {
    str = "USE " + db + ";";
    connection.query(str , function(err) {
        if (err) {
            console.log("Problems with MySQL: "+err);
            connection.end();
        }
        else {
            console.log("Use DB: Success");
            createTable();
        }
    });
}

function createTable() {
    connection.query("CREATE TABLE IF NOT EXISTS till_buttons (buttonID int primary key, `left` INT, `top` INT, `width` INT, label TEXT, invID INT);", function(err) {
        if(err) {
            console.log("Problems with MySQL: "+err);
            connection.end();
        }
        else {
            console.log("createTable: Success");
            truncate();
        }
    });
}

function truncate() {
    connection.query("TRUNCATE till_buttons;", function(err) {
        if(err) {
            console.log("Problems with MySQL: "+err);
            connection.end();
        }
        else {
            console.log("Truncate: Success");
            loadDB();
        }
    });
}

function loadDB() {
    connection.query("LOAD DATA LOCAL INFILE 'resources/data.txt' INTO TABLE till_buttons;", function(err){
        if(err) {
            console.log("Problems with MySQL: "+err);
            connection.end();
        }
        else {
            console.log("Load DB: Success");
            connection.end();
        }
    });
}
