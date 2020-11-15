// @ts-nocheck
const AccountCsvImporter = require('../js/AccountCsvImporter');
var accountImporter = new AccountCsvImporter(__dirname + '/config/rules.test.json',__dirname + '/config/accounts.test.json');

it("AccountCSV importer: test file epargne.csv should import 155 elements", () => {
    return accountImporter.Import( __dirname +"/import_csv/epargne.test.csv", "Compte chèque de Cyrille").then( data=> {
        expect(accountImporter.GetTransactions().GetLength()).toBe(155);
    });
});

it("AccountCSV importer: test file credit.csv should total 169 elements", () => {
    return accountImporter.Import( __dirname +"/import_csv/credit.test.csv", "Mastercard de Cyrille").then( data=> {
        expect(accountImporter.GetTransactions().GetLength()).toBe(169);
    });
});



