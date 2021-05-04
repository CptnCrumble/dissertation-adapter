var fs = require('fs');

const rawData = fs.readFileSync('./data.json');
const data = JSON.parse(rawData);

function filterSummaryStatisticData(record) {
    if (
        record['NMS TOTAL'] !== undefined &&
        record['NMS TOTAL'] !== 'N/A' &&
        record['PDSS TOTAL'] !== undefined &&
        record['PDSS TOTAL'] !== 'N/A' &&
        record['PDQ TOTAL'] !== undefined &&
        record['PDQ TOTAL'] !== 'N/A' &&
        record['PDQSI'] !== undefined &&
        record['PDQSI'] !== 'N/A' &&
        record['Anxiety'] !== undefined &&
        record['Anxiety'] !== 'N/A' &&
        record['Depression'] !== undefined &&
        record['Depression'] !== 'N/A' &&
        record['BKS'] !== undefined &&
        record['BKS'] !== 'N/A' &&
        record['DKS'] !== undefined &&
        record['DKS'] !== 'N/A' &&
        record['FDS'] !== undefined &&
        record['FDS'] !== 'N/A' &&
        record['PTI'] !== undefined &&
        record['PTI'] !== 'N/A' &&
        record['PTT'] !== undefined &&
        record['PTT'] !== 'N/A' &&
        record['PDQ-SI '] !== undefined &&
        record['PDQ-SI '] !== 'N/A' &&
        record['Mob '] !== undefined &&
        record['Mob '] !== 'N/A' &&
        record['ADL '] !== undefined &&
        record['ADL '] !== 'N/A' &&
        record['Emot '] !== undefined &&
        record['Emot '] !== 'N/A' &&
        record['Stigma '] !== undefined &&
        record['Stigma '] !== 'N/A' &&
        record['Soc Sup '] !== undefined &&
        record['Soc Sup '] !== 'N/A' &&
        record['Cog '] !== undefined &&
        record['Cog '] !== 'N/A' &&
        record['Comm '] !== undefined &&
        record['Comm '] !== 'N/A' &&
        record['Discom '] !== undefined &&
        record['Discom '] !== 'N/A' &&
        record['PDQ-C-SI'] !== undefined &&
        record['PDQ-C-SI'] !== 'N/A'
    ) {        
        return {
            'NMS TOTAL': record['NMS TOTAL'],
            'PDSS TOTAL': record['PDSS TOTAL'],
            'PDQ TOTAL': record['PDQ TOTAL'],
            'PDQSI': record['PDQSI'],
            'Anxiety': record['Anxiety'],
            'Depression': record['Depression'],
            'BKS': record['BKS'],
            'DKS': record['DKS'],
            'FDS': record['FDS'],
            'PTI': record['PTI'],
            'PTT': record['PTT'],
            'PDQ-SI ': record['PDQ-SI '],
            'Mob ': record['Mob '],
            'ADL ': record['ADL '],
            'Emot ': record['Emot '],
            'Stigma ': record['Stigma '],
            'Soc Sup ': record['Soc Sup '],
            'Cog ': record['Cog '],
            'Comm ': record['Comm '],
            'Discom ': record['Discom '],
            'PDQ-C-SI': record['PDQ-C-SI']
        }
    } else {
        return {};
    }
}
let filtered = data.map( n => filterSummaryStatisticData(n)).filter(x => Object.keys(x).length !== 0);
console.log(filtered.length);