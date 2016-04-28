var express = require('express');
var router = express.Router();
var redis = require('../redisTest');
var transactionDao = require('../TransactionDAO');

var Sequelize = require('sequelize');
var sequelize = new Sequelize('m031001', 'root', 'hychen123', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        idle: 10000
    }
});

transactionDao.setConnectionPool(sequelize);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' , body: 'Welcome to TestCase'});
});

/*router.get('/connect/:uno', function(req, res, next) {
  //app.handle_database(req,res);
  console.log(req.params.uno);
  db.pool.getConnection(function(err,conn){
    if(err) throw err;
    conn.query("select * from customer where UNO = ?",[req.params.uno] ,function(err,rows){
      if(err) throw err;
      console.log(rows);
      res.render('index',{title:'Express', body:"query db ok : "+rows[0]['NAME']});
    });
    conn.release();
  });
});*/

router.get('/connect/:uno', function(req, res, next) {
  var sql = "select * from customer where UNO = ?";
  var ans = Tsql.querySql(sql, [req.params.uno], function(rows){
    //console.log(rows);
    res.render('index',{title:'Express', body:"query db with aop ok : "+rows[0]['NAME']});
  });

});

router.get('/connect2/:id', function(req, res, next) {
  var sql = "select * from customer where id = ?";
  var ans = Tsql.querySql(sql, [req.params.id], function(rows){
    //console.log(rows);
    res.render('index',{title:'Express', body:"query db with aop ok : "+rows[0]['UNO']+" - "+rows[0]['NAME']});
  });

});

router.get('/case1',function(req, res, next) {
      res.render('case1');
});

router.get('/case1-2',function(req, res, next) {
    res.render('case1-2');
});

router.post('/saveCustomer',function(req,res){
    var body = req.body;
    saveData(body, function(err,returnStr){
        if(err) res.render('result',{result:err});
        else {
            res.render('result',{result:returnStr});
        }
    });
});

router.get('/getRedisKeyValue/:account',function(req,res){
    redis.getRedisData(req.params.account, function(reply){
        res.render('result', {result:reply})
    });
});

router.post('/saveCustomer2',function(req,res){
    console.log(req.query);
    var body = req.query;
    res.setHeader('Content-Type', 'application/json');

    saveData(body, function(err,returnStr){
        if(err) res.end(JSON.stringify({result:err}));
        else {
            res.end(JSON.stringify({ result: returnStr}));
        }
    });


});

/*function saveData(body, next) {
    var result = null;
    sequelize.transaction({
        //isolationLevel:Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
        //autoCommit:false
    },function(t){
        return sequelize.query('insert into customer(UNO, NAME, EMAIL, ENABLE, NOTES, LOCALE_CODE, CREATOR_ID, CREATE_DATE, MODIFIER_ID, MODIFY_DATE, CUST_TYPE, ADDR1) ' +
            'VALUES(?,?,?,1,123,\'zh_TW\',1,sysdate(),1,sysdate(),1,0)',
                                
            {replacements:[body.uno, body.name, body.account],
                     type:sequelize.QueryTypes.INSERT,
                transaction:t})

            .then(function(d){
            return sequelize.query('select count(*) as size from customer',{type:sequelize.QueryTypes.SELECT, transaction:t}).then(function(result, metadata){console.log('raw size:'+result[0]['size']);
                return sequelize.query('insert into admin (logon_id, logon_pwd, name) values(:account,:password,:name)',
                                        {replacements:{account:body.account, password:body.password, name:body.username}, type:sequelize.QueryTypes.INSERT, transaction:t})
                    .then(function (admin) {
                        redis.saveRedisData(body.account, body.username);
                    // console.log(admin);
                });
            });
        });
    }).then(function(result){
        //auto commit here
        next(null, 'insert ok');

    }).catch(function(err){
        //rollback here
        next(err);

    });
}*/

function saveData(body, next) {
    var sqls = new Array();
    sqls.push(['insert into customer(UNO, NAME, EMAIL, ENABLE, NOTES, LOCALE_CODE, CREATOR_ID, CREATE_DATE, MODIFIER_ID, MODIFY_DATE, CUST_TYPE, ADDR1) ' +
        'VALUES(?,?,?,1,123,\'zh_TW\',1,sysdate(),1,sysdate(),1,0)', [body.uno, body.name, body.account]]);
    sqls.push(['insert into admin (logon_id, logon_pwd, name) values(:account,:password,:name)', {account:body.account, password:body.password, name:body.username}]);
    console.log(sqls);
    transactionDao.executeTransaction(sqls, next);
}
module.exports = router;
