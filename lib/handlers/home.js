module.exports = handler

var debug = require('debug')('qpm_testcoin:home')
var wc = require('webcredits')
var fs = require('fs')
var wc_db = require('wc_db')
var qpm_ui = require('qpm_ui')

function handler(req, res) {

  var origin = req.headers.origin
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }

  var defaultCurrency = res.locals.config.currency || 'https://w3id.org/cc#bit'

  var source      = req.body.source
  var destination = req.body.destination
  var currency    = req.body.currency || defaultCurrency
  var amount      = req.body.amount
  var timestamp   = null
  var description = req.body.description
  var context     = req.body.context


  var source      = req.session.userId

  if (!req.session.userId) {
    res.send('Must be authenticated via WebID.  Get a webid <a href="https://databox.me/">NOW</a>!')
    return
  }

  var faucetURI = 'https://w3id.org/cc#faucet'

  var config = res.locals.config

  res.status(200)
  res.header('Content-Type', 'text/html')


  var head   = qpm_ui.head
  var nav    = qpm_ui.nav(config)
  var footer = qpm_ui.footer

  var body = `
  <div>
     Wallet : <a href="`+ config.wallet +`">`+ config.wallet +`</a><br>
     <a href="/wallet/test">Manage wallet</a><br>
  </div>
  `



  res.write(head)
  res.write(nav)
  res.write(body)
  res.write(footer)
  res.end()


}
