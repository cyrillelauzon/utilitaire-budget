/*-------------------------------------------------------------------------
File: app.js
Description: 
Main entry point for app and express requests handling
-------------------------------------------------------------------------*/
const express = require('express');
const app = express();
const AccountsBook = require('./src/AccountsBook');
let bankAccount = new AccountsBook;


InitApp();
/**
 * @description 
 */
async function InitApp() {
    console.debug(" ");
    console.debug("*******************************************");
    console.debug("*******Bank transaction server running*****");
    console.debug("*******************************************");
    console.debug(" ");
    console.debug("=====Express: Initializing server=====");

    console.debug(" ");

    //TEMP //TODO (will change to import csv file from post request)
   // await bankAccount.ImportCSV("f://2020-11-25-095220.csv", "Compte chèque de Cyrille");
    //await bankAccount.ImportCSV("./import_csv/epargne.csv", "Compte chèque de Cyrille");
    //await bankAccount.ImportCSV("./import_csv/credit.csv", "Mastercard de Cyrille");
    //   bankAccount.SelectTransactions();

    console.debug("=====Express: End init=====");
    console.debug(" ");

    /**
     * @description Listening on port 5000 after Init is done
     */
    app.listen(5000, () => {
        console.log("listening on port 5000");
    })

}

/**
 * @description Get Request for transactions
 */
app.get('/transactions/:description/:year/:month', async (req, resp) => {

    console.debug("=====Express: new Get transactions request=====");
    const { description, year, month } = req.params;
    console.debug(`Request Content: description=${description} year=${year} month=${month}`);
    let transactions = await bankAccount.SelectTransactions(description, year, month);

    resp.set("Access-Control-Allow-Origin", "*");
    if(transactions !== undefined)resp.send(transactions.GetArray());
    else resp.send("");
    console.debug("=====En Request=====");
    console.debug(" ");

});


/**
 * @description post request for new transactions
 */
app.post('/importcsv', (req, resp) => {
    resp.send('Import csv file will be done at this address');

});