/*-------------------------------------------------------------------------
Classe: BankAccount
Description: 
Lecture d'un état de compte bancaire en format CSV, formattage et exportation vers un autre CSV

//Utilise le RuleParser et rules.csv.
//Pour l'instant le fichiers categories n'a pas d'utilité
-------------------------------------------------------------------------*/


const Transaction = require('./Transaction');
const RuleParser = require('./RuleParser');

module.exports = class BankAccount {

    /**
     * @constructor
     * @descriptionCreates an instance of BankAccount.
     */
    constructor() {

        this.type = "type"; //personnel, celi, crédit...
        this.description = "description"; //Description de lutilisateur
        this.nom = "nom"; //nom du compte
        this.proprietaire = "proprietaire"; //proprio du compte
       
        this.transactions = new Map();
        this.ruleParser = new RuleParser();
    }


    /**
     *ImporterTransactionCSV
     * @description Lit une liste de transactions à partir d'un fichier CSV donné en paramètre
     * et l'enregistre dans la base de données.
     * 
     * @param {string} nomFichierCsv
     * @throws Error si le fichier est invalide
     * @async
     */
    async ImportTransactionsCSV(nomFichierCsv) {
        const csv = require('fast-csv');
        const fs = require('fs');

        console.log("Début d'importation du fichier Csv: " + nomFichierCsv);

        const p = new Promise((resolve, reject) => {
            //Lecture du fichier csv 
            //ajout des transaction par rangées dans l'objet Map transactions afin de verifier les dupliqués
            fs.createReadStream(nomFichierCsv)
                .pipe(csv.parse({ headers: true }))
                .on('error', (err) => {
                    reject(p);
                })
                .on('data', (row) => {

                    try {
                      let transaction = new Transaction();
                      transaction.SetTransaction(0, row['Date'], row['Description'], row['Categorie'], row['Debit'], row['Credit'], row['Solde']);
                      this.AjouterTransactionMap(transaction);

                    } catch (err) {
                        console.debug("Transaction lue dans fichier CSV est invalide: " + err);
                    }

                })
                .on('end', async () => {
                    //await this.AjouterTransactionsBD();
                    this.ExporterTransactionsCSV("./testexport.csv");
                    resolve(p);
                });
        }).catch(error => { console.log('caught promise', error.message); });

        await p;


    }


    /**
     * AjouterTransactionMap
     * @description Ajoute une nouvelle transaction lors de la lecture d'un fichier CSV
     * 
     * @param {Transaction} transaction Nouvelle transaction à ajouter
     * @throws {Error} Si paramètre transaction est invalide
     */
    AjouterTransactionMap(transaction) {
        //Lors de l'importation du fichier CSV, si erreur lors de validation des données, ne pas ajouter ces transactions.
        if (transaction === undefined) return;
        if(transaction.IsEmpty() === true) return;

        //Vérification si on a affaire à une double ou multiple transaction d'un meme montant le meme jour, au meme lieu
        //Si oui: creer un nouveau _id unique pour cette transaction
        let counter = 0;
        let strID = transaction.GetID();
        while (this.transactions.has(strID)) {
           counter += 1;
           strID = Transaction.BuildTransactionID(counter, transaction.date, transaction.Description, transaction.Amount);
        }

        
        let nouvTransaction = new Transaction();
        nouvTransaction.SetTransactionWithAmount(counter, transaction.date, transaction.Description, transaction.Category, transaction.Amount, transaction.Balance);
        
        //Parse new transaction to auto apply categories
        nouvTransaction = this.ruleParser.ParseTransaction(nouvTransaction);

        //Add transaction to map
        this.transactions.set(strID, nouvTransaction);
    }


    /**
     * @description
     */
    async AjouterTransactionsBD() {

    }

    /**
     * @description Transform categories based on RuleParser object
     */
    /* ParseCategoryRules(){
        let rules = new RuleParser();
        rules.ParseBankAccount(this.GetTransactionsArray());
    }
 */
    GetTransactionsArray(){
        return Array.from(this.transactions.values());
    }

    /**
     * ExporterTransactionsCSV
     * @description Exporte transaction de la bd vers un fichier CSV
       Utilisation de csv-writer:
       https://stackabuse.com/reading-and-writing-csv-files-with-node-js/
     * 
     * @param {string} nomFichier
     */
    ExporterTransactionsCSV(nomFichier) {

        const createCsvWriter = require('csv-writer').createObjectCsvWriter;
        let arrTransactions = this.GetTransactionsArray();


        const csvWriter = createCsvWriter({
            path: nomFichier,
            header: [{
                    id: 'date',
                    title: 'Date'
                },
                {
                    id: 'Description',
                    title: 'Description'
                },
                {
                    id: 'Category',
                    title: 'Categorie'
                },
                {
                    id: 'Amount',
                    title: 'Montant'
                },
                {
                    id: 'Balance',
                    title: 'Solde'
                }
            ]
        });
        csvWriter
            .writeRecords(Array.from(this.transactions.values()))
            .then(() => console.log('The CSV file ' + nomFichier + ' was written successfully'));
    }

    /**
     * ImprimerTransactions
     * @description Imprime une liste de transactions vers la console
     * 
     * @param {Map} transactions
     */
    ImprimerTransactions(transactions) {
        transactions.forEach(function (transaction) {
            if (transaction !== null) {
                console.log("Transaction: " + transaction);
            }
        });
    }
}
