var mysql = require('mysql');

var db = module.exports = {};

db.pool = mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'root',
    password : 'hychen123',
    database : 'm031001',
    debug    :  false
});

db.pool.on('connection', function (connection) {
    connection.query('SET SESSION auto_increment_increment=1');
    console.log('in connectino event');
});

db.connect = function handle_database(req,res) {

    pool.getConnection(function(err,connection){
        if (err) {
            connection.release();
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query("select * from user",function(err,rows){
            connection.release();
            if(!err) {
                res.json(rows);
            }
        });

        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        });
    });
};