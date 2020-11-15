/*-------------------------------------------------------------------------
File: app.js
Description: 
Main entry point for app and express requests handling
-------------------------------------------------------------------------*/
const express = require('express');
const app = express();
const AccountsBook = require('./js/AccountsBook');

let bankAccount = new AccountsBook;
InitApp();

/**
 * @description 
 */
function InitApp(){
    bankAccount.ImportCSV("./import_csv/epargne.csv", "Compte chèque de Cyrille");
    bankAccount.ImportCSV("./import_csv/credit.csv", "Mastercard de Cyrille");
}


/**
 * @description Get Request for root page
 */
app.get('/', (req, resp) => {
    resp.send('Hello World');

});

/**
 * @description Get Request for transactions
 */
app.get('/transactions', (req, resp) => {
    resp.send('Transaction list');
    

});

/**
 * @description Tells express to listen to port 3000
 */
app.listen(3000, () => {
    console.log("listening on port 3000");
})
