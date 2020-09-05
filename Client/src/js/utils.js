let fs = require('fs')
let path = require('path')

let dataDir = path.join(__dirname, '../data')


function dumpData (filename, data) 
{
    let dataPath = path.join(dataDir, filename)
    let strData = JSON.stringify(data, null, '    ')
    
    try {
        fs.unlinkSync(dataPath);
    }
    catch (e) {

    }
    setTimeout(() => { // ファイルに連続してアクセスすると落ちる
        const stream = fs.createWriteStream(dataPath)
        stream.write(strData, "utf8")
        stream.end()    
    }, 2000)
}
exports.dumpData = dumpData;


function loadData (filename) 
{
    let dataPath = path.join(dataDir, filename)
    let data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
    return data
}
exports.loadData = loadData;



function getCosineSimilarity (signupVector, loginVector) 
{
    if (signupVector != undefined && loginVector != undefined) 
    {
        if (signupVector.length == loginVector.length) 
        {
            let signupKeyStrokeMagunitude = getMagnitude(signupVector);
            let loginKeyStrokeMagunitude = getMagnitude(loginVector);
            let multipliedSum = getMultipliedSum(signupVector, loginVector);
            cosineSimilarity = multipliedSum / (signupKeyStrokeMagunitude * loginKeyStrokeMagunitude);
            let digit = 2
            let offset = Math.pow(10, digit)
            cosineSimilarity = Math.round(cosineSimilarity * offset) / offset  
            return cosineSimilarity
        }
        else {
            return null
        }
    }
    else {
        return null
    }
    // コサイン類似度
    // https://www.cse.kyoto-su.ac.jp/~g0846020/keywords/cosinSimilarity.html
}
exports.getCosineSimilarity = getCosineSimilarity;    

function getKeyStrokeVector(timestamps) {
    let diffs = []
    let digit = 3
    for (let i = 0; i < timestamps.length-1; i++) {
        let diff = timestamps[i+1] - timestamps[i];
        let offset = Math.pow(10, digit)
        diff = Math.round(diff * offset)/offset    
        diffs.push(diff);
    }
    return diffs;
}
exports.getKeyStrokeVector = getKeyStrokeVector;

function getMagnitude(vector) {
    let squeredSum = 0;
    for (let i = 0; i < vector.length; i++) {
        squeredSum += Math.pow(vector[i], 2);
    }
    let magnitude = Math.sqrt(squeredSum);
    return magnitude;
}
function getMultipliedSum(vector1, vector2) {
    if (vector1.length != vector2.length) {
        return NaN;
    }
    let multipliedSum = 0;
    for (let i = 0; i < vector1.length; i++) {
        multipliedSum += (vector1[i] * vector2[i]);
    }
    return multipliedSum;
}