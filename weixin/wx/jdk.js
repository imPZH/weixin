'use Strict'
const fs     = require('fs'),
      https  = require('https'),
      crypto = require('crypto');


class Wx {
    constructor ( appId, appSecret ) {
        this.appId     = appId;
        this.appSecret = appSecret;
    }

    getSignature ( args ) {
       let tempArray = [],
           hash      = crypto.createHash( 'sha1' );
       for ( let key in args ) {
           tempArray.push({
               key   :  key,
               value :  args[ key ]
               })
       }
       tempArray.sort(function( arg1, arg2 ){
           if ( arg1.key > arg2.key ){
               return 1;
           } else if ( arg1.key < arg2.key ){
               return -1;
           }
               return 0;
       });
       tempArray.forEach(function( item, index, array ){
           array[ index ] = item.key + '=' + item.value;
       });
       let list = tempArray.join('&');
       hash.update( list );
       let hashcode = hash.digest('hex');

       return hashcode;
    }

    getSignPackage ( url, callback ) {
       this.getJsApiTicket( ( ticket ) => {
           let noncestr      = this.createNonceStr(),
               signature     = "",
               timestamp     = Math.floor( Date.now()/1000 ),
               string        = "jsapi_ticket=" + ticket
                             + "&noncestr="    + noncestr
                             + "&timestamp="   + timestamp
                             + "&url="         + url,
               hash          = crypto.createHash( 'sha1' );
               hash.update( string );
               signature     = hash.digest('hex');
           let signPackage   = {
               appId        :      this.appId,
               nonceStr     :      noncestr,
               timestamp    :      timestamp,
               url          :      url,
               signature    :      signature,
               rawString    :      string
           }
           callback ? callback( signPackage ) : ()=>{};
       });
    }

    createNonceStr ( len ) {
       let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
           str   = "";
           len   = len || 16;

       for ( let i = 0; i < len; i++ ) {
           str += chars [ Math.floor( Math.random() * 62 ) ];
       }
       return str;
    }

    getAccessToken ( callback ) {
       let accessToken = '';
       fs.readFile( './database/access_token.json', (err, data) => {
           if ( err ) throw err;

           data = JSON.parse( data );

           if ( data.expire_time > Date.now() ) {
               accessToken = data.access_token;
               callback( accessToken );
           } else {
               let url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + this.appId + "&secret="+ this.appSecret;
               https.get( url, (res) => {
                   res.setEncoding('utf8');
                   let rawData = '';
                   res.on('data', (chunk) => rawData += chunk);
                   res.on('end', () => {
                       try {
                           let parsedData = JSON.parse(rawData);
                           let data = {};

                           data.expire_time  = Date.now() +　7000000;
                           data.access_token = parsedData.access_token;
                           fs.writeFile( './database/access_token.json', JSON.stringify(data));
                           accessToken = parsedData.access_token;
                           callback( accessToken );
                       } catch (e) {
                           console.log(e.message);
                       }
                   });
               });

           }
       } );
    }

    getJsApiTicket ( callback ) {
       let ticket = '';
       fs.readFile( './database/jsapi_ticket.json', (err, data) => {
           if ( err ) throw err;

           data = JSON.parse( data );

           if ( data.expire_time > Date.now() ) {
               ticket = data.jsapi_ticket;
               callback( ticket );
           } else {
               this.getAccessToken( ( accessToken ) => {
                   console.log(accessToken);
                   let url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=" + accessToken;
                   https.get( url, (res) => {
                       res.setEncoding('utf8');
                       let rawData = '';
                       res.on('data', (chunk) => rawData += chunk);
                       res.on('end', () => {
                           try {
                               let parsedData = JSON.parse(rawData);
                               let data = {};
                               data.expire_time  = Date.now() +　7000000;
                               data.jsapi_ticket = parsedData.ticket;
                               fs.writeFile( './database/jsapi_ticket.json', JSON.stringify(data));
                               let ticket = parsedData.ticket;
                               callback( ticket );
                           } catch (e) {
                               console.log(e.message);
                           }
                       });
                   });
               });



           }
       } );
    }
}

module.exports = Wx;
