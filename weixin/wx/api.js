'use strict'


const fs = require('fs');
const http = require('http');
function login(){}


function save(){}


module.exports = {
    getQuestions : function( callback ){
        fs.readFile('./database/questions.json', ( err, data ) => {
            if (err) throw err;

            let questions = JSON.parse(data);

            callback(questions);
        });

    }

}