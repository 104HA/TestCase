var nodeaop = require("node-aop");
var db = require('../db/db');
var Aop = function() {
};
Aop.prototype.rows = null;
Aop.prototype.connect = null;

Aop.prototype.setDBConn = function(obj) {
    for (func in obj) {
        if(typeof obj[func]=='function' && func=='queryExecute'){
            nodeaop.before(obj, func, function(sql, parameters, next) {
                console.log('before')
                db.pool.getConnection(function (err, conn) {
                    if (err) throw err;
                    conn.query(sql, parameters, function(err,rows){
                        if(err) throw err;
                        //Aop.connect = conn;
                        //console.log(aoprows);
                        next(rows);
                    });
                    conn.release();
                });
            });
        }
    }
}

/*Aop.prototype.getRows = function() {
    console.log(aoprows);
    return aoprows;
}*/


module.exports = Aop;