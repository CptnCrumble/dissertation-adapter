if(typeof require !== 'undefined') XLSX = require('xlsx');
var fs = require('fs');

var result = [];

//--------------------------- ### pkg spreadsheet ###--------------------------------------------------------------------
var workbook = XLSX.readFile('PKGv2.xlsx');

function filterNoTimepoint(obj) {
    if(typeof obj.Timepoint !== "number"){        
        return false;
    } else {
        return true;
    }
}

function filterNoWearbable(obj) {
    if (obj.BKS === undefined) {        
        return false;
    } else {
        return true;
    }
}

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

//--------------------------------------- ### PDQ 39 etc spreadsheet ### -------------------------------------------------
var pdqWorkbook = XLSX.readFile('PDQ39v2.xlsx');

function removeRepeatData(obj) {
    delete obj['Number'];
    delete obj['Date of assessment'];
    delete obj['Date of assess'];
    delete obj['Timepoint'];
}

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


//---------------- Flatten  data points (Number & Timepoint as primary keys)-------------------------------------------------

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

// filter empty objects from array
let flatClean = flatResult.filter(value => JSON.stringify(value) !== '{}');

//------ NORMALISE ---------------------------------------------------------------------------------------------------------------

function normalise(record) {
    return {
        'Number': record["Number"],
        'Timepoint': record["Timepoint"],
        'Gender': record["Gender"],
        'NMS-1': record["NMS1"],
        'NMS-2': record["NMS2"],
        'NMS-3': record["NMS3"],
        'NMS-4': record["NMS4"],
        'NMS-5': record["NMS5"],
        'NMS-6': record["NMS6"],
        'NMS-7': record["NMS7"],
        'NMS-8': record["NMS8"],
        'NMS-9': record["NMS9"],
        'NMS-10': record["NMS10"],
        'NMS-11': record["NMS11"],
        'NMS-12': record["NMS12"],
        'NMS-13': record["NMS13"],
        'NMS-14': record["NMS14"],
        'NMS-15': record["NMS15"],
        'NMS-16': record["NMS16"],
        'NMS-17': record["NMS17"],
        'NMS-18': record["NMS18"],
        'NMS-19': record["NMS19"],
        'NMS-20': record["NMS20"],
        'NMS-21': record["NMS21"],
        'NMS-22': record["NMS22"],
        'NMS-23': record["NMS23"],
        'NMS-24': record["NMS24"],
        'NMS-25': record["NMS25"],
        'NMS-26': record["NMS26"],
        'NMS-27': record["NMS27"],
        'NMS-28': record["NMS28"],
        'NMS-29': record["NMS29"],
        'NMS-30': record["NMS30"],
        'NMS-31': record["NMS31"],
        'NMS-TOTAL': record["NMS TOTAL"],
        'PDSS-1': record["PDSS1"],
        'PDSS-2': record["PDSS2"],
        'PDSS-3': record["PDSS3"],
        'PDSS-4': record["PDSS4"],
        'PDSS-5': record["PDSS5"],
        'PDSS-6': record["PDSS6"],
        'PDSS-7': record["PDSS7"],
        'PDSS-8': record["PDSS8"],
        'PDSS-9': record["PDSS9"],
        'PDSS-10': record["PDSS10"],
        'PDSS-11': record["PDSS11"],
        'PDSS-12': record["PDSS12"],
        'PDSS-13': record["PDSS13"],
        'PDSS-14': record["PDSS14"],
        'PDSS-15': record["PDSS15"],
        'PDSS-TOTAL': record["PDSS TOTAL"],
        'PDQ8-1': record["PDQ1"],
        'PDQ8-2': record["PDQ2"],
        'PDQ8-3': record["PDQ3"],
        'PDQ8-4': record["PDQ4"],
        'PDQ8-5': record["PDQ5"],
        'PDQ8-6': record["PDQ6"],
        'PDQ8-7': record["PDQ7"],
        'PDQ8-8': record["PDQ8"],
        'PDQ8-9': record["PDQ9"],
        'PDQ8-10': record["PDQ10"],
        'PDQ8-11': record["PDQ11"],
        'PDQ8-12': record["PDQ12"],
        'PDQ8-13': record["PDQ13"],
        'PDQ8-14': record["PDQ14"],
        'PDQ8-15': record["PDQ15"],
        'PDQ8-TOTAL': record["PDQ TOTAL"],
        'PDQ8-PDQSI': record["PDQSI"],
        'HADS-TENSE': record["HADS TENSE"],
        'HADS-ENJOY': record["HADS ENJOY"],
        'HADS-FRIGHT': record["HADS FRIGHT"],
        'HADS-LAUGH': record["HADS LAUGH"],
        'HADS-WORRY': record["HADS WORRY"],
        'HADS-CHEER': record["HADS CHEER"],
        'HADS-EASE': record["HADS EASE"],
        'HADS-SLOW': record["HADS SLOW"],
        'HADS-BUTTERFLY': record["HADS BUTTERFLY"],
        'HADS-INTEREST': record["HADS INTEREST"],
        'HADS-RESTLESS': record["HADS RESTLESS"],
        'HADS-FORWARD': record["HADS FORWARD"],
        'HADS-PANIC': record["HADS PANIC"],
        'HADS-BOOK': record["HADS BOOK"],        
        'Anxiety': record['Anxiety'],
        'Depression': record['Depression'],
        'BKS': record['BKS'],
        'DKS': record['DKS'],
        'FDS': record['FDS'],
        'PTI': record['PTI'],
        'PTT': record['PTT'],
        'PDQ39-1': record["(1) leis"],
        'PDQ39-2': record["(2) DIY"],
        'PDQ39-3': record["(3) bags"],
        'PDQ39-4': record["(4) 0.5 mile"],
        'PDQ39-5': record["(5) 100yds"],
        'PDQ39-6': record["(6) house"],
        'PDQ39-7': record["(7) public"],
        'PDQ39-8': record["(8) else"],
        'PDQ39-9': record["(9) fright"],
        'PDQ39-10': record["(10) confined"],
        'PDQ39-11': record["(11) wash"],
        'PDQ39-12': record["(12) dress"],
        'PDQ39-13': record["(13) buttons"],
        'PDQ39-14': record["(14) write"],
        'PDQ39-15': record["(15) food"],
        'PDQ39-16': record["(16) drink"],
        'PDQ39-17': record["(17) depressed"],
        'PDQ39-18': record["(18) lonely"],
        'PDQ39-19': record["(19) weepy"],
        'PDQ39-20': record["(20) angry"],
        'PDQ39-21': record["(21) anxious"],
        'PDQ39-22': record["(22) future"],
        'PDQ39-23': record["(23) conceal"],
        'PDQ39-24': record["(24) avoid"],
        'PDQ39-25': record["(25) embarrassed"],
        'PDQ39-26': record["(26) reactions"],
        'PDQ39-27': record["(27) relationship"],
        'PDQ39-28': record["(28) support"],
        'PDQ39-29': record["(29) family"],
        'PDQ39-30': record["(30) asleep"],
        'PDQ39-31': record["(31) concen"],
        'PDQ39-32': record["(32) memory"],
        'PDQ39-33': record["(33) dreams"],
        'PDQ39-34': record["(34) speech"],
        'PDQ39-35': record["(35) communicate"],
        'PDQ39-36': record["(36) ignored"],
        'PDQ39-37': record["(37) cramps"],
        'PDQ39-38': record["(38) pain"],
        'PDQ39-39': record["(39) hot"],
        'PDQ39-PDQSI': record["PDQ-SI "],
        'PDQ39-Mob': record["Mob "],
        'PDQ39-ADL': record["ADL "],
        'PDQ39-Emot': record["Emot "],
        'PDQ39-Stigma': record["Stigma "],
        'PDQ39-Soc-Sup': record["Soc Sup "],
        'PDQ39-Cog': record["Cog "],
        'PDQ39-Comm': record["Comm "],
        'PDQ39-Discom': record["Discom "],
        'UPDRS-2.1': record["2.1"],
        'UPDRS-2.2': record["2.2"],
        'UPDRS-2.3': record["2.3"],
        'UPDRS-2.4': record["2.4"],
        'UPDRS-2.5': record["2.5"],
        'UPDRS-2.6': record["2.6"],
        'UPDRS-2.7': record["2.7"],
        'UPDRS-2.8': record["2.8"],
        'UPDRS-2.9': record["2.9"],
        'UPDRS-2.10': record["2.1_1"],
        'UPDRS-2.11': record["2.11"],
        'UPDRS-2.12': record["2.12"],
        'UPDRS-2.13': record["2.13"],
        'UPDRS-2.14': record["2.14"],
        'UPDRS-2.15': record["2.15"],
        'UPDRS-TOTAL': record["Total"],
        'PDQC-1': record["pdqc 1"],
        'PDQC-2': record["pdqc 2"],
        'PDQC-3': record["pdqc 3"],
        'PDQC-4': record["pdqc 4"],
        'PDQC-5': record["pdqc 5"],
        'PDQC-6': record["pdqc 6"],
        'PDQC-7': record["pdqc 7"],
        'PDQC-8': record["pdqc 8"],
        'PDQC-9': record["pdqc 9"],
        'PDQC-10': record["pdqc 10"],
        'PDQC-11': record["pdqc 11"],
        'PDQC-12': record["pdqc 12"],
        'PDQC-13': record["pdqc 13"],
        'PDQC-14': record["pdqc 14"],
        'PDQC-15': record["pdqc 15"],
        'PDQC-16': record["pdqc 16"],
        'PDQC-17': record["pdqc 17"],
        'PDQC-18': record["pdqc 18"],
        'PDQC-19': record["pdqc 19"],
        'PDQC-20': record["pdqc 20"],
        'PDQC-21': record["pdqc 21"],
        'PDQC-22': record["pdqc 22"],
        'PDQC-23': record["pdqc 23"],
        'PDQC-24': record["pdqc 24"],
        'PDQC-25': record["pdqc 25"],
        'PDQC-26': record["pdqc 26"],
        'PDQC-27': record["pdqc 27"],
        'PDQC-28': record["pdqc 28"],
        'PDQC-29': record["pdqc 29"],
        'PDQC-PDQSI': record["PDQ-C-SI"],
        'PDQC-social/personal-activities': record["social/personal activities"],
        'PDQC-anx/dep': record["anx/dep"],
        'PDQC-Self-care': record["Self-care"],
        'PDQC-Stress': record["Stress"]
    }
}

let final = flatClean.map( x => normalise(x));

 // ------------------------------------------------------------------------------------------------------------------


// // --- Write JSON array to file, replaces existing file ---
fs.writeFile('./data/common-data.json',JSON.stringify(final), function (err) {
    if (err) throw err;
    console.log('Saved!');
  });

//   fs.writeFile('./tmp.json',JSON.stringify(result), function (err) {
//     if (err) throw err;
//     console.log('Saved!');
//   });
