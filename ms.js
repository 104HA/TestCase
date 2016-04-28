var mysql          = require('mysql');

var pool = null, connection = null;

module.exports = MS;

function MS(){
    pool = mysql.createPool({
        connectionLimit : 5, //important
        host     : 'localhost',
        user     : 'root',
        password : 'hychen123',
        database : 'm031001',
        debug    :  false
    });

/*    pool.on('connection', function (connection) {
        console.log('get connection from pool' );
       // console.log(connection);
    });
    pool.on('enqueue', function () {
        console.log('Waiting for available connection slot');
    });*/

}

MS.prototype.getConn = function (next) {
    pool.getConnection(function (err, conn) {
        if (err) throw err;
        connection = conn;
        console.log(connection);
        next(conn);
    });
};

MS.prototype.releaseConn = function() {
    if(connection) {
        try {
            connection.release();
        }
        catch(e){
            console.log(e.message);
        }
        //console.log('connection released');
    }
    else console.log('nothing released.');
}




