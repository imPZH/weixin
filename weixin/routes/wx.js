var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const hash = crypto.createHash( 'sha1' );

const TOKEN = 'impzh';

/* GET wx page. */
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
	if ( checkSignature( signature, timestamp, nonce) ) {
		res.send( echostr );
	} else {
		return;
	}
});

/**
*   微信服务器接入验证。
**/
function checkSignature ( signature, timestamp, nonce ) {
    var tempArray = [];
    tempArray.push(timestamp);
    tempArray.push(nonce);
    tempArray.push(TOKEN);
    tempArray.sort();
    var list = tempArray.join('');
    hash.update( list );
    var hashcode = hash.digest('hex');
    if (hashcode == signature){
        return true;
    } else {
        return false;
    }
}
module.exports = router;
