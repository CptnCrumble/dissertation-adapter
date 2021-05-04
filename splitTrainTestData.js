var fs = require('fs');

const rawData = fs.readFileSync('./data.json');
const data = JSON.parse(rawData);

function findIndex(number,timepoint,array) {
    for (let index = 0; index < array.length; index++) {
        if(
            array[index]['Number'] === number &&
            array[index]['Timepoint'] === timepoint
        ) {
            return index;
        }
    }
}

function createTestData(number,timepoint,array) {
    let i = findIndex(number,timepoint,array);
    return array[i];
}

function createTrainData(number,timepoint,array) {
    let output = JSON.parse(JSON.stringify(array));
    let i = findIndex(number,timepoint,array);
    output.splice(i,1);
    return output;
}

// Seperate test & train for N=2, T=0
let testData = createTestData(2,0,data);
let trainData = createTrainData(2,0,data);

console.log(testData);
console.log(trainData.length);
console.log(data.length)
