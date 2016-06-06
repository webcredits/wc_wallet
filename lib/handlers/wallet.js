module.exports = handler

var debug = require('debug')('wc_wallet:wallet')
var fs = require('fs')
var qpm_media = require('qpm_media')
var Negotiator = require('negotiator')
var wc = require('webcredits')
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

  var availableMediaTypes = ['text/html', 'text/plain', 'application/json', 'application/turtle']

  var negotiator = new Negotiator(req)
  var mediaType = negotiator.mediaType(availableMediaTypes)

  config = res.locals.config
  debug(mediaType)

  res.status(200)
  res.header('Content-Type', mediaType)
  if (mediaType === 'text/html') {

    var head   = qpm_ui.head
    var nav    = qpm_ui.nav(config)
    var footer = qpm_ui.footer

    var body = `
    <div>
    Wallet name : ` + config.walletname + `<br>
    Wallet URI : <a target="_blank" href="`+ config.wallet +`">` + config.wallet + `</a><br>
    HDPublicKey : ` + config.HDPublicKey + `<br>
    Maker : <a target="_blank" href="`+ config.maker +`">` + config.maker + `</a><br>
    </div>
    `



    res.write(head)
    res.write(nav)
    res.write(body)
    res.write(footer)

    res.end()
  } else if ( mediaType === 'application/json' ) {

    res.write(config)
    res.end()
  } else if ( mediaType === 'application/turtle' ) {
    debug('turtle')

    var turtle = `<#this> a <https://w3id.org/cc#Wallet> ;
    <http://www.w3.org/2000/01/rdf-schema#label> "`+ config.walletname +`";
    <http://xmlns.com/foaf/0.1/maker> <`+ config.maker +`> ;
    <https://w3id.org/cc#Wallet> "`+ config.HDPublicKey +`" .
    `
    res.write(turtle)
    debug(turtle)
    res.end()
  } else if ( mediaType === 'text/plain' ) {

    res.write(config)
    res.end()
  }


}
