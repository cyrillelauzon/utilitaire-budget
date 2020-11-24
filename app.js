/*-------------------------------------------------------------------------
File: app.js
Description: 
Main entry point for app and express requests handling
-------------------------------------------------------------------------*/
const express = require('express');
const app = express();
const AccountsBook = require('./js/AccountsBook');
let bankAccount = new AccountsBook;


/**
 * @description 
 */
async function InitApp(){
    console.debug(" ");
    console.debug("*******************************************");
    console.debug("*******Bank transaction server running*****");
    console.debug("*******************************************");
    console.debug(" ");
    console.debug("=====Express: Initializing server=====");
    console.log("listening on port 5000");
    console.debug(" ");

    //TEMP (will change to import csv file from put request)
    await bankAccount.ImportCSV("./import_csv/epargne.csv", "Compte chèque de Cyrille");
    await bankAccount.ImportCSV("./import_csv/credit.csv", "Mastercard de Cyrille");
//   bankAccount.SelectTransactions();
    
    console.debug("=====Express: End init=====");
    console.debug(" ");
}

/**
 * @description Tells express to listen to port 3000
 */
app.listen(5000, () => {
    InitApp();
})


/**
 * @description Get Request for root page
 */
app.get('/', (req, resp) => {
    resp.send('Hello World');

});

/**
 * @description Get Request for transactions
 */
app.get('/transactions/:description', async (req, resp) => {

    console.debug("=====Express: new Get transactions request=====");

    let transactions = await bankAccount.SelectTransactions(req.params.description);    
    resp.set("Access-Control-Allow-Origin", "*");
    resp.send(transactions.GetArray());

    console.debug("=====En Request=====");
    console.debug(" ");

});


/**
 * @description post request for new transactions
 */
app.post('/importcsv', (req, resp) => {
    resp.send('Import csv file will be done at this address');

});