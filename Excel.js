var xlsx = require('node-xlsx');
var xlsBuilder = require('exceljs');
var Excel = {
};

Excel.parseFile = function parseFile(next) {
    var obj = xlsx.parse(__dirname + '/ehrms2.xlsx'); // parses a file
    //console.log(obj[0].data);
    var str  = obj[0].data;
    //console.log(str);
    next(null, str);
};

Excel.buildFile = function buildFile(next){
    var workbook = new xlsBuilder.Workbook();
    var sheet = workbook.addWorksheet('My Sheet', 'FFC0000');
    sheet.addRow([3, 'Sam', new Date()]);
    workbook.xlsx.writeFile(__dirname+"/buildExcel_"+new Date().getTime()+".xlsx")
        .then(function() {
            console.log('create done');
        });
    next(null);
};

module.exports = Excel;




