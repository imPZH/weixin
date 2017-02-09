var express = require('express');
var router = express.Router();
var api = require('../wx/api');
const TOKEN = 'impzh';

router.get('/getQuestions', function(req, res, next) {
	api.getQuestions( (data)=>{

        let retData = [];

        data.forEach( (item, index, arr) => {
            retData.push( item.content );
        });
        res.send(retData);
    });
});

module.exports = router;
