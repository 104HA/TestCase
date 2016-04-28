//var aop = require('./aop');

var Tsql= function() {};


Tsql.prototype.querySql = function(sql, parameters, next){
    this.queryExecute(sql, parameters, function(rows){
        next(rows);
        return rows;
    })
}

Tsql.prototype.queryExecute = function(sql,parameters, next){}


module.exports = Tsql;
