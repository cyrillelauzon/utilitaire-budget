const AccountRulesParser = require('./js/AccountRulesParser');



const AccountsBook = require('./js/AccountsBook');
let bankAccount = new AccountsBook;

bankAccount.ImportTransactionsCSV("./import_csv/epargne.csv", "Compte chèque de Cyrille");
//bankAccount.ImportTransactionsCSV("./import_csv/credit.csv", "Mastercard de Cyrille");
//bankAccount.ExportCSVTransactions("./testexport2.csv");

