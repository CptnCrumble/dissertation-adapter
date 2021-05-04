let noms = [
    'NMS TOTAL',
    'PDSS TOTAL',
    'PDQ TOTAL',
    'PDQSI',
    'Anxiety',
    'Depression',
    'BKS',
    'DKS',
    'FDS',
    'PTI',
    'PTT',
    'PDQ-SI ',
    'Mob ',
    'ADL ',
    'Emot ',
    'Stigma ',
    'Soc Sup ',
    'Cog ',
    'Comm ',
    'Discom ',
    'PDQ-C-SI'
]

// noms.map( x => console.log('record[\'%s\'] !== undefined &&\nrecord[\'%s\'] !== \'N/A\' &&',x,x))
noms.map( x => console.log('\'%s\': record[\'%s\'],',x,x))