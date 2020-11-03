const RuleParser = require('./js/RuleParser');



const BankAccount = require('./js/BankAccount');
let bankAccount = new BankAccount;

bankAccount.ImportTransactionsCSV("./import_csv/epargne.csv", "Compte chèque de Cyrille");
//bankAccount.ExportCSVTransactions("./testexport2.csv");

