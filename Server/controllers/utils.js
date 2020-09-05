let fs = require('fs')
let path = require('path')


let dataDir = path.join(__dirname, '../data')


function dumpData (filename, data) 
{
    let dataPath = path.join(dataDir, filename)
    fs.writeFileSync(dataPath, JSON.stringify(data, null, '    '));
}
exports.dumpData = dumpData;


function loadData (filename) 
{
    let dataPath = path.join(dataDir, filename)
    try {
        const data = JSON.parse(fs.readFileSync(dataPath, "utf8"))
        return data
    }
    catch(e) {
        console.log(e.message);
        return null
    }
}
exports.loadData = loadData;

function removeData (filename) {
    let dataPath = path.join(dataDir, filename)
    try {
        fs.unlinkSync(dataPath);
        //console.log('remove!');
    } 
    catch (error) {
        //throw error;
    }
}
exports.removeData = removeData;
