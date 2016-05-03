var express = require('express');
var router = express.Router();
//var redis = require('../redisTest');
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

/*set connection pool*/
transactionDao.setConnectionPool(sequelize);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' , body: 'Welcome to TestCase'});
});

router.get('/case1',function(req, res, next) {
      res.render('case1');
});

router.get('/case1-2',function(req, res, next) {
    res.render('case1-2');
});

router.post('/saveCustomer',function(req,res){
    var body = req.body;

/*  未包裝 */
/*    saveDataWrap(body, function(err,returnStr){
        if(err) res.render('result',{result:err});
        else {
            res.render('result',{result:returnStr});
        }
    });
*/

/* 已包裝*/
    saveDataWrap(body, function(err,returnStr){
        if(err) res.render('result',{result:err});
        else {
            res.render('result',{result:returnStr});
        }
    });
});

/*router.get('/getRedisKeyValue/:account',function(req,res){
    redis.getRedisData(req.params.account, function(reply){
        res.render('result', {result:reply})
    });
});*/

/*test ajax response*/
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

/*call sequelize transaction*/
function saveData(body, next) {
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
}

/*包裝sequelize*/
function saveDataWrap(body, next) {
    var sqls = [];
    sqls.push(['insert into customer(UNO, NAME, EMAIL, ENABLE, NOTES, LOCALE_CODE, CREATOR_ID, CREATE_DATE, MODIFIER_ID, MODIFY_DATE, CUST_TYPE, ADDR1) ' +
        'VALUES(?,?,?,1,123,\'zh_TW\',1,sysdate(),1,sysdate(),1,0)', [body.uno, body.name, body.account]]);
    sqls.push(['insert into admin (logon_id, logon_pwd, name) values(:account,:password,:name)', {account:body.account, password:body.password, name:body.username}]);
    console.log(sqls);
    transactionDao.executeTransaction(sqls, next);
}
module.exports = router;
