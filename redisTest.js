var redisTest = {};
var redis = require("redis"),
    client = redis.createClient();

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

client.on("error", function (err) {
    console.log("Error " + err);
});

redisTest.saveRedisData = function(key, value){
    client.set(key, value, redis.print);
}

redisTest.getRedisData = function(key, next) {
    client.get(key, function(err,reply){
        if(reply) next(reply);
        else console.log(err);
    });
}

module.exports = redisTest;