if(typeof require !== 'undefined') XLSX = require('xlsx');

// ### pkg spreadsheet ###
var workbook = XLSX.readFile('PKGv2.xlsx');

var result = [];

function combinePkgData(questionnaireData, wearableData, output) {
    questionnaireData.map((row) => {
        if (filterNoAssessment(row)) {
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

function filterNoAssessment(obj) {
    if(obj['Assessment Number'] === undefined ){
        console.log('removing %s - No Assessment number',obj.Number);
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

console.log('n of results is %s',result.length);

// ### PDQ 39 etc spreadsheet ### 
var pdqWorkbook = XLSX.readFile('pdq39_etc.xlsx');

function combinePdqData(pdq39data, updrsData, pdqcData, output) {

}

function filterNoTimepoint(obj) {
    if(typeof obj.Timepoint !== "number"){
        console.log('removing %s - No Timepoint',obj.Number);
        return false;
    } else {
        return true;
    }
}