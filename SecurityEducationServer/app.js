var express = require('express');
var app = express();
var http = require('http').Server(app);
const PORT = process.env.PORT || 8000;
app.set("view engine", "ejs");
app.use('/static', express.static(__dirname + '/public'));
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


var form = require('./controllers/formAuth')
var candr = require('./controllers/candrAuth')
var keystroke = require('./controllers/keyStrokeAuth')
var digsig = require('./controllers/digitalSignature')
var totp = require('./controllers/totpAuth')
var fido = require('./controllers/fidoAuth')
var utils = require('./controllers/utils')


app.get('/' , (req, res) => {
  const formData = utils.loadData('form.json')
  if (formData != null) 
  {
    form.signupUsername = formData.signupUsername
    form.signupPassword = formData.signupPassword
    form.signupPasswordHashValue = formData.signupPasswordHashValue
    form.loginUsername = formData.loginUsername
    form.loginPassword = formData.loginPassword
    form.loginPasswordHashValue = formData.loginPasswordHashValue
    form.authResult = formData.authResult  
  }

  const candrData = utils.loadData('candr.json')
  if (candrData != null) 
  {
    candr.username = candrData.username
    candr.password = candrData.password
    candr.challenge = candrData.challenge
    candr.response = candrData.response
    candr.hashValue = candrData.hashValue  
    candr.authResult = candrData.authResult  
  }

  const totpData = utils.loadData('totp.json')
  if (totpData != null) 
  {
    totp.secret = totpData.secret
    totp.authCode = totpData.authCode
    totp.trueCode = totpData.trueCode
    totp.authResult = totpData.authResult
  }

  const keyStrokeData = utils.loadData('keystroke.json')
  if (keyStrokeData != null) 
  {
    keystroke.signupVector = keyStrokeData.signupVector
    keystroke.loginVector = keyStrokeData.loginVector
    keystroke.match = keyStrokeData.match
    keystroke.eer = keyStrokeData.eer
    keystroke.authResult = keyStrokeData.authResult  
  }

  const digsigData = utils.loadData('digsig.json')
  if (digsigData != null) 
  {
    digsig.data = digsigData.data
    digsig.signature = digsigData.signature
    digsig.verifyResult = digsigData.verifyResult
  }

  const fidoData = utils.loadData('fido.json')
  if (fidoData != null) 
  {
    fido.signupUsername = fidoData.signupUsername
    fido.signupChallenge = fidoData.signupChallenge
    fido.signupSignature = fidoData.signupSignature
    fido.loginUsername = fidoData.loginUsername
    fido.loginChallenge = fidoData.loginChallenge
    fido.loginSignature = fidoData.loginSignature
    fido.publicKey = fidoData.publicKey
    fido.authResult = fidoData.authResult
  }

  res.render("index")
});


// Form認証
app.post('/form-signup', form.signup)
app.post('/form-login', form.login)


// チャレンジアンドレスポンス認証
app.post('/candr-signup', candr.signup)
app.post('/candr-login-username', candr.loginWithUsername)
app.post('/candr-login-response', candr.loginWithResponse)


// キーストローク認証
app.post('/key-stroke-signup', keystroke.signup)
app.post('/key-stroke-login', keystroke.login)
app.post('/key-stroke-eer', keystroke.eer)

// デジタル署名
app.post('/digital-signature-submit', digsig.submit)

// TOTP認証
app.post('/totp-show-qrcode', totp.showQRCode)
app.post('/totp-login', totp.login)

// FIDO認証
app.post('/fido-signup-username', fido.signupWithUsername)
app.post('/fido-signup-response', fido.signupWithResponse)
app.post('/fido-login-username', fido.loginWithUsername)
app.post('/fido-login-response', fido.loginWithResponse)


// reload
app.get('/info' , (req, res) => {
  let info = {}

  info['formSignupUsername'] = form.signupUsername
  info['formSignupPassword'] = form.signupPassword
  info['formSignupPasswordHashValue'] = form.signupPasswordHashValue
  info['formLoginUsername'] = form.loginUsername
  info['formLoginPassword'] = form.loginPassword
  info['formLoginPasswordHashValue'] = form.loginPasswordHashValue
  info['formAuthResult'] = form.authResult

  info['candrSignupUsername'] = candr.username
  info['candrSignupPassword'] = candr.password
  info['candrChallenge'] = candr.challenge
  info['candrResponse'] = candr.response
  info['candrHashValue'] = candr.hashValue  
  info['candrAuthResult'] = candr.authResult  

  info['totpSecret'] = totp.secret
  info['totpAuthCode'] = totp.authCode
  info['totpTrueCode'] = totp.trueCode
  info['totpAuthResult'] = totp.authResult

  info['keyStrokeSignupVector'] = keystroke.signupVector
  info['keyStrokeLoginVector'] = keystroke.loginVector
  info['keyStrokeMatch'] = keystroke.match
  info['keyStrokeEER'] = keystroke.eer
  info['keyStrokeAuthResult'] = keystroke.authResult  

  info['digsigData'] = digsig.data
  info['digsigSignature'] = digsig.signature
  info['digsigVerifyResult'] = digsig.verifyResult

  info['fidoSignupUsername'] = fido.signupUsername
  info['fidoSignupChallenge'] = fido.signupChallenge
  info['fidoSignupSignature'] = fido.signupSignature
  info['fidoLoginUsername'] = fido.loginUsername
  info['fidoLoginChallenge'] = fido.loginChallenge
  info['fidoLoginSignature'] = fido.loginSignature
  info['fidoPublicKey'] = fido.publicKey
  info['fidoAuthResult'] = fido.authResult

  res.send(info)
})


http.listen(PORT, function(){
  console.log('server listening. Port:' + PORT);
});