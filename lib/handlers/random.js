module.exports = handler

var debug = require('debug')('random')
var fs = require('fs')
var qpm_media = require('qpm_media')
var Negotiator = require('negotiator')
var wc = require('webcredits')
var wc_db = require('wc_db')
var qpm_ui = require('qpm_ui');

function handler(req, res) {

  var origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  var defaultCurrency = res.locals.config.currency || 'https://w3id.org/cc#bit';

  var source      = req.body.source;
  var destination = req.body.destination;
  var currency    = req.body.currency || defaultCurrency;
  var amount      = req.body.amount;
  var timestamp   = null;
  var description = req.body.description;
  var context     = req.body.context;




  if (!req.session.userId) {
    res.send('must be authenticated')
    return
  }

  var source      = req.session.userId

  if (!req.session.userId) {
    res.send('must be authenticated')
    return
  }


  var config = res.locals.config
  var cost = 25
  var faucetURI = 'https://w3id.org/cc#faucet'

  var sequelize = wc_db.getConnection(config.db);
  wc.getBalance(source, sequelize, config, function(err, ret){
    if (err) {
      console.error(err);
    } else {
      console.log(ret);
      var balance = ret

      if (balance > cost) {

        var credit = {};

        credit["https://w3id.org/cc#source"] = req.session.userId
        credit["https://w3id.org/cc#amount"] = cost
        credit["https://w3id.org/cc#currency"] = 'https://w3id.org/cc#bit'
        credit["https://w3id.org/cc#destination"] = faucetURI
        balance -= cost


        wc.insert(credit, res.locals.sequelize, res.locals.config, function(err, ret) {
          if (err) {
            res.write(err);
          } else {

            qpm_media.getRandomImage(function(err, ret){
              if (err) {
                console.error(err)
              } else {
                console.log(ret)
                var availableMediaTypes = ['text/html', 'text/plain', 'application/json']

                var negotiator = new Negotiator(req)
                var mediaType = negotiator.mediaType(availableMediaTypes)
                console.log(mediaType)

                if (ret === null) {
                  ret = 0
                }
                var image = ret[0][0].uri
                res.status(200)
                res.header('Content-Type', mediaType)
                if (mediaType === 'text/html') {

                  var head   = qpm_ui.head;
                  var nav    = qpm_ui.nav;
                  var footer = qpm_ui.footer;

                  var body = `
                  <div>
                     <img src="`+ image + `"><br>
                     Original image <a target="_blank" href="` + image + `">` + image + `</a><br>
                     <a href="/balance">Balance</a> : ` + balance + ` |
                     <a href="/random">Refresh</a><br>
                  </div>
                  `;



                  res.write(head);
                  res.write(nav);
                  res.write(body);
                  res.write(footer);

                  res.end()
                } else if ( mediaType === 'application/json' ) {
                  res.write('{ "image" : "'+image+'"}')
                  res.end()
                } else if ( mediaType === 'text/plain' ) {
                  res.write(image)
                  res.end()
                }
              }
              sequelize.close()
            })


          }

        });


      } else {
        res.statusCode = 402;
        res.send('HTTP 402!  This resource has paid access control!')
      }


    }
    sequelize.close();
  });


}
