if(typeof require !== 'undefined') XLSX = require('xlsx');
var fs = require('fs');

// ### pkg spreadsheet ###
var workbook = XLSX.readFile('PKGv2.xlsx');

var result = [];

function combinePkgData(questionnaireData, wearableData, output) {
    questionnaireData.map((row) => {
        if (filterNoTimepoint(row)) {
            let tpoint = row.Number;
            let match = wearableData.find(r => r.Number === tpoint);
            if(filterNoWearbable(match)) {
                let data = {
                    ...row,
                    'BKS': match.BKS,
                    'DKS': match.DKS,
                    'FDS': match.FDS,
                    'PTI': match.PTI,
                    'PTT': match.PTT
                };
                output.push(data);
            }
        }        
    });
} 

function filterNoTimepoint(obj) {
    if(typeof obj.Timepoint !== "number"){
        console.log('removing %s - No Timepoint',obj.Number);
        return false;
    } else {
        return true;
    }
}

function filterNoWearbable(obj) {
    if (obj.BKS === undefined) {
        console.log('removing %s - No wearable data found', obj.Number);
        return false;
    } else {
        return true;
    }
}

// --- Timepoint 0 AKA baseline ---

const baselineQuestionnaires = workbook.Sheets[workbook.SheetNames[0]];
const baselinePkg = workbook.Sheets[workbook.SheetNames[3]];
var qdata = XLSX.utils.sheet_to_json(baselineQuestionnaires);
var pkgData = XLSX.utils.sheet_to_json(baselinePkg);

combinePkgData(qdata,pkgData,result);

// --- Timepoint 1 AKA 6 month ---

const t1qs = workbook.Sheets[workbook.SheetNames[1]];
const t1pkg = workbook.Sheets[workbook.SheetNames[4]];
var t1qdata = XLSX.utils.sheet_to_json(t1qs);
var t1pkgdata = XLSX.utils.sheet_to_json(t1pkg);

combinePkgData(t1qdata,t1pkgdata,result);

// --- Timepoint 2 AKA 12 month ---

const t2qs = workbook.Sheets[workbook.SheetNames[2]];
const t2pkg = workbook.Sheets[workbook.SheetNames[5]];
var t2qdata = XLSX.utils.sheet_to_json(t2qs);
var t2pkgdata = XLSX.utils.sheet_to_json(t2pkg);

combinePkgData(t2qdata,t2pkgdata,result);

// ### PDQ 39 etc spreadsheet ### 
var pdqWorkbook = XLSX.readFile('PDQ39v2.xlsx');

function combinePdqData(pdq39data, updrsData, pdqcData, output) {
    pdq39data.map((row) => {
        if(filterNoTimepoint(row)) {
            let tpoint = row.Number;
            let match1 = updrsData.find(r => r.Number === tpoint);
            if(filterNoTimepoint(match1)){
                removeRepeatData(match1);
                match1 = {
                    ...row,
                    ...match1
                };
            }
            let match2 = pdqcData.find(r => r.Number === tpoint);
            if(filterNoTimepoint(match2)) {
                removeRepeatData(match2);
                match1 = {
                    ...match1,
                    ...match2
                };
            }
            output.push(match1);
        }
    });
}

function removeRepeatData(obj) {
    delete obj['Number'];
    delete obj['Date of assessment'];
    delete obj['Date of assess'];
    delete obj['Timepoint'];
}



// --- Timepoint 0 ---
const t0pdq39 = XLSX.utils
    .sheet_to_json(pdqWorkbook.Sheets[pdqWorkbook.SheetNames[0]]);
const t0updrs = XLSX.utils
    .sheet_to_json(pdqWorkbook.Sheets[pdqWorkbook.SheetNames[1]]);
const t0pdqc = XLSX.utils
    .sheet_to_json(pdqWorkbook.Sheets[pdqWorkbook.SheetNames[2]]);

combinePdqData(t0pdq39, t0updrs, t0pdqc, result);

// --- Timepoint 1 ---
const t1pdq39 = XLSX.utils
    .sheet_to_json(pdqWorkbook.Sheets[pdqWorkbook.SheetNames[3]]);
const t1updrs = XLSX.utils
    .sheet_to_json(pdqWorkbook.Sheets[pdqWorkbook.SheetNames[4]]);
const t1pdqc = XLSX.utils
    .sheet_to_json(pdqWorkbook.Sheets[pdqWorkbook.SheetNames[5]]);

combinePdqData(t1pdq39, t1updrs, t1pdqc, result);


// Flatten  data points (Number & Timepoint as primary keys)

let flatResult = [];

function combineTimepointData(number,timepoint,array){    
    let grouping = array.filter(x => x.Number == number)
        .filter(y => y.Timepoint == timepoint);
    return Object.assign({},...grouping);
}

let maxValues = { 'Number' : 0, 'Timepoint' : 0};
result.forEach((obj) => {
    if(obj.Number > maxValues.Number){
        maxValues.Number = obj.Number;
    }
    if(obj.Timepoint > maxValues.Timepoint) {
        maxValues.Timepoint = obj.Timepoint;
    }
});
console.log(maxValues);

for (let i = 0; i < (maxValues.Number + 1); i++) {
    for (let j = 0; j < (maxValues.Timepoint + 1); j++) {
        flatResult.push(combineTimepointData(i,j,result));
    }   
}

// console.log('n of results is %s',result.length);
// flatResult.map( (r) => {
//     if(r.Number === 1){
//         console.log(r);
//     }
// })

// // --- Write JSON array to file, replaces existing file ---
fs.writeFile('./data.json',JSON.stringify(flatResult), function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
