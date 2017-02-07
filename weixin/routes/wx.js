'use Strict'

const express      = require('express');
const https        = require('https');
const crypto       = require('crypto');
const mongoose     = require('mongoose');
const config       = require('../config');
const Wx           = require('../wx/jdk');

const wx           = new Wx( config.appId, config.appSecret );
const router       = express.Router();
// const db           = mongoose.connect('mongodb://112.74.175.77/weixin');
// const Schema       = mongoose.Schema;


router.get('/', function(req, res, next) {
	var query = req.query,
      signature = query.signature,
      timestamp = query.timestamp,
      nonce = query.nonce,
      echostr = query.echostr;
	if ( !signature || !timestamp || !echostr || !nonce ) {
		res.render('index', { title: 'weixin' });
		return;
	}
	if ( signature === getSignature( timestamp, nonce) ) {
		res.send( echostr );
	} else {
		return;
	}
});

router.post('/setConfig', function(req, res, next) {
	let body = JSON.parse( req.body );
	let url  = body.url ? body.url : req.protocol + '://' + req.hostname + req.originalUrl;
	wx.getSignPackage( url, ( signPackage ) => {
		res.send( signPackage );
	});
});



module.exports = router;
