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

// ### PDQ 39 etc spreadsheet ### 
var pdqWorkbook = XLSX.readFile('pdq39_etc.xlsx');

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

function filterNoTimepoint(obj) {
    if(typeof obj.Timepoint !== "number"){
        console.log('removing %s - No Timepoint',obj.Number);
        return false;
    } else {
        return true;
    }
}

// --- Timepoint 0 ---
const t0pdq39 = XLSX.utils
    .sheet_to_json(pdqWorkbook.Sheets[pdqWorkbook.SheetNames[0]]);
const t0updrs = XLSX.utils
    .sheet_to_json(pdqWorkbook.Sheets[pdqWorkbook.SheetNames[1]]);
const t0pdqc = XLSX.utils
    .sheet_to_json(pdqWorkbook.Sheets[pdqWorkbook.SheetNames[2]]);

combinePdqData(t0pdq39, t0updrs, t0pdqc, result);

console.log('n of results is %s',result.length);
result.map( (r) => {
    if(r.Number === 1){
        console.log(r);
    }
})