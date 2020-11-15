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
    await bankAccount.ImportCSV("./import_csv/epargne.csv", "Compte chèque de Cyrille");
    await bankAccount.ImportCSV("./import_csv/credit.csv", "Mastercard de Cyrille");
//   bankAccount.SelectTransactions();
    
}

/**
 * @description Tells express to listen to port 3000
 */
app.listen(3000, () => {
    InitApp();
    console.log("listening on port 3000");
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
    //resp.send('The list of transactions where descriptions is: ' + req.params.description);
    
    let transactions = await bankAccount.SelectTransactions(req.params.description);    
    //resp.setHeader('Content-Type', 'application/json');
    resp.send(transactions.GetArray());

});


/**
 * @description post request for new transactions
 */
app.post('/importcsv', (req, resp) => {
    resp.send('Import csv file will be done at this address');

});