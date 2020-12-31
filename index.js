// Import modules
let cron = require('node-cron')
let expressSession = require('express-session')
let bodyParser = require('body-parser')
let express = require('express')
// import memory store
var MemoryStore = require('memorystore')(expressSession)
let app = express()
let hbs = require('hbs')
let dbHelper = require('./database/dbHelper')
let config = require('./config')
let businessWire = require('./sites/businessWire')
let accessWire = require('./sites/accessWire')
let globalNewsWire = require('./sites/globalNewsWire')
let prNewsWire = require('./sites/prNewsWire')
let helpers = require('./util/helpers')
let nodemailer = require('nodemailer');

// Templating engine settings
hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs')
app.use(express.static(__dirname + '/public'))

// Express session settigns
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressSession({
  cookie: { maxAge: 43200000 },
    store: new MemoryStore({
      checkPeriod: 43200000
    }),
    resave: false,
    secret: config.sessionSecret,
    saveUninitialized: true
}))

async function fetchAll() {
  await businessWire.fetchBusinessWire()
  await accessWire.fetchAccessWire()
  await globalNewsWire.fetchGlobalNewsWire()
  await prNewsWire.fetchPrNewsWire()
  await removeErrors()
}

async function removeErrors() {
  console.log('Removing Errors..')
  try {
    let res = await dbHelper.getAllErrorsFromWSJ()
    await dbHelper.deleteErrorsInWSJ()

    for(let i = 0; i < res.length; i++) {
      let foo = await dbHelper.getHitWithID(res[i].id)

      await dbHelper.deleteRowInhits(foo[0].url)

      if(helpers.extractHostname(foo[0].url) === 'www.businesswire.com') {
        await dbHelper.deleteRowInBusinessNewsWire(foo[0].url)
      }
      else if(helpers.extractHostname(foo[0].url) === 'www.globenewswire.com') {
        await dbHelper.deleteRowInGlobalNewsWire(foo[0].url)
      }
      else if (helpers.extractHostname(foo[0].url) === 'www.accesswire.com') {
        await dbHelper.deleteRowInAccessNewsWire(foo[0].url)
      }
      else if (helpers.extractHostname(foo[0].url) === 'www.prnewswire.com') {
        await dbHelper.deleteRowInPrNewsWire(foo[0].url)
      }
    }
    console.log('Errors Removed')
  }  
  catch(ex) {
    console.log(ex)
  }
}

cron.schedule('0 0 * * *', async () => {
  console.log('Cleaning Database..')
  await dbHelper.deleteOldData()
  console.log('Database Cleaned')
})

app.get('/hits', async function (req, res) {
  
  let data = await dbHelper.getAllHits()
  
  res.render('home', {
    data: data
  })

})

app.get('/', async (req, res) => {
  if(req.session.user) {

    if (req.query.atCloseMin != undefined && req.query.atCloseMax != undefined) {
    
    }
  
    if (req.query.afterHoursMin != undefined && req.query.afterHoursMax != undefined) {
      
    }
  
    if (req.query.floatMin != undefined && req.query.floatMax != undefined) {
      
    }
  
    if (req.query.volumeMin != undefined && req.query.volumeMax != undefined) {
      
    }

    let wsjData = await dbHelper.getDataWSJ()
    let hitsOnly = await dbHelper.getHitsWithoutWSJ()

    res.render('index', {
      baseURL: config.webAddress,
      data: wsjData,
      hitsOnly: hitsOnly
    })

  }
  else {
    res.redirect(config.webAddress + 'login')
  }
})

app.post('/', async (req, res) => {

  let username = req.body.username;
  let password = req.body.password;

  let user = await dbHelper.checkLogin(username, password)

  if(user.length > 0) {
    req.session.user = user[0]      
    res.redirect(config.webAddress)
  }
  else {
    res.redirect(config.webAddress + 'login')
  }  

})

app.get('/login', async (req, res) => {
  res.render('login', {
    baseURL: config.webAddress
  })
})

app.get('/recover-password', (req, res) => {

  let code = helpers.get6DigitCode()
  req.session.code = code

  // send 6-digit verification code to Ale's email id
  var transporter = nodemailer.createTransport({
    host: "mail.letsoft.org",
    port: 290,
    secure: true, // upgrade later with STARTTLS
    auth: {
      user: "adeel-ahmed@letsoft.org",
      pass: "Flash9360"
    }
  });
  
  var mailOptions = {
    from: 'adeel-ahmed@letsoft.org',
    to: 'arrepa321@gmail.com',
    subject: 'Password Recovery - 6 Digit Verification Code',
    text: 'Your 6-digit verification code is: ' + code
  };
  
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } 
    else {
      console.log('Email sent: ' + info.response);
    }
  });

  res.render('password-recovery', {
    baseURL: config.webAddress,
    status: ''
  })
})

app.post('/recover-password', (req, res) => {
  let code = req.body.code

  if (code == req.session.code) {
    req.session.codeVerified = true
    res.redirect(config.webAddress + 'recover-password/new-password')
  }
  else {
    res.render('password-recovery', {
      baseURL: config.webAddress,
      status: 'invalidCode'
    })
  }
})

app.get('/recover-password/new-password', (req, res) => {
  if (req.session.codeVerified === true) {
    res.render('new-password', {
      baseURL: config.webAddress
    })
  }
  else {
    res.send('Oops! something went wrong :/')
  }
})

app.post('/recover-password/new-password', async (req, res) => {
  if (req.session.codeVerified === true) {
    let newPass = req.body.newPassword
    await dbHelper.updateAdminPass(newPass)

    req.session.destroy()

    res.redirect(config.webAddress)
  }
  else {
    res.send('Oops! something went wrong :/')
  }
})

app.get('/stay_awake',(req,res) => {
  return res.send('Hello');
})

app.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect(config.webAddress + 'login')
})

const port = process.env.PORT || 3000

app.listen(port, async () => {
  console.log('Crawler Started...')
  fetchAll()
  setInterval(fetchAll, 700000)
})