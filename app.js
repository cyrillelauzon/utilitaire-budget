const express = require('express');
const app = express();

const AccountsBook = require('./js/AccountsBook');
let bankAccount = new AccountsBook;


app.get('/', (req, resp) => {
    resp.send('Hello World');

});


app.get('/transactions', (req, resp) => {
    resp.send('transactions');
    "./import_csv/epargne.csv"
    bankAccount.ImportCSV("./import_csv/epargne.csv", "Compte chèque de Cyrille");
    bankAccount.ImportCSV("./import_csv/credit.csv", "Mastercard de Cyrille");

});


app.listen(3000, () => {
    console.log("listening on port 3000");
})
