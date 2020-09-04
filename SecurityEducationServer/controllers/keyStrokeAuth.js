var utils = require('./utils')

var signupVector = ''
var loginVector = ''
var eer = 0.5
var match = -1
var authResult = ''

exports.signup = function (req, res)
{
    let requests = req.body
    signupVector = requests['signup-vector']
    exports.signupVector = signupVector

    let result = {'auth':true}
    res.send(result)
}

exports.login = function (req, res)
{
    let requests = req.body
    loginVector = requests['login-vector']
    exports.loginVector = loginVector

    match = getCosineSimilarity(signupVector, loginVector)
    if (match != null) {
        if (match >= eer) {
            authResult = true
        } else {
            authResult = false
        }
    }
    else{
        match = 'エラー：文字数が一致していません'
        authResult = false
    }
    exports.match = match
    exports.eer = eer
    exports.authResult = authResult

    let results = {
        'signupVector':signupVector, 
        'loginVector':loginVector, 
        'match':match, 
        'eer':eer, 
        'authResult':authResult
    }
    utils.dumpData('keystroke.json', results)
    res.send(results)
}


exports.eer = function (req, res)
{
    let requests = req.body
    eer = requests['eer']
    exports.eer = eer

    res.send(eer)
}

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

function getCosineSimilarity(signupVector, loginVector) 
{
  if (signupVector != undefined && loginVector != undefined) 
  {
    if (signupVector.length == loginVector.length) {
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
  return null
}