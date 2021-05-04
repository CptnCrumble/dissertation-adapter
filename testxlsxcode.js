if(typeof require !== 'undefined') XLSX = require('xlsx');

var workbook = XLSX.readFile('PKGv2.xlsx');


console.log(workbook.SheetNames)
console.log(workbook.SheetNames.find( n => n === '69 Month Qs'))