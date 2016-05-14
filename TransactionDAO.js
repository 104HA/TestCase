var TransactionDAO = {
    size:0,
    count:0,
    sqlArray:null,
    paramObjArray:null,
    sequelize:null
};

TransactionDAO.setConnectionPool = function(connection) {
    this.sequelize = connection;    
};

TransactionDAO._subTransaction = function(sql, param, t) {
    return this.sequelize.query(sql,{transaction:t, replacements:param}).then(
        function() {
            if (this.count < this.size) {
                var sql = this.sqlArray[this.count][0];
                var param = this.sqlArray[this.count][1];
                this.count++;

                return this._subTransaction(sql, param, t);
            }
            else {
                console.log('no more sql');
            }
        }.bind(this)
    );
};

TransactionDAO.executeTransaction = function(sqls, next){ //sqls: [[sql][parameters]]
    this.count = 0;
    this.sqlArray = sqls;
    this.size = this.sqlArray.length;
    this.sequelize.transaction({
        //isolationLevel:Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
        //autoCommit:false
    },function(t){
        var sql = this.sqlArray[this.count][0];
        var param = this.sqlArray[this.count][1];
        this.count++;
        return this._subTransaction(sql, param, t);
    }.bind(this)).then(function(result){
        console.log(result);
        //auto commit here
        next(null, 'insert ok');
    }).catch(function(err){
        //rollback here
        console.log(err);
        next(err);

    });
};

module.exports = TransactionDAO;
