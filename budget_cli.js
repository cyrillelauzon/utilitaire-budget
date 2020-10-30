const CompteBancaire = require('./CompteBancaire');

let compteBancaire = new CompteBancaire;

compteBancaire.ImporterTransactionsCSV("./import_csv/epargne.csv");
