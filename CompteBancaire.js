/*-------------------------------------------------------------------------
Classe: CompteBancaire
Description: 
Gestion d'un compte bancaire: ex compte personnel, carte de crédit
-------------------------------------------------------------------------*/
module.exports = class CompteBancaire {

    /*-------------------------------------------------------------------------
    Méthode: constructor
    Description: 
    Lecture automatique de la liste des transactions dans le fichier CSV
	-------------------------------------------------------------------------*/
    constructor() {
        this.transactions = new Array();
        this.type = "type"; //personnel, celi, crédit...
        this.description = "description"; //Description de lutilisateur
        this.nom = "nom"; //nom du compte
        this.proprietaire = "proprietaire"; //proprio du compte


        //Création d'un schema de transaction Mangoose
        const mongooseDB = require('mongoose');
        const transactionSchema = new mongooseDB.Schema({
            _id: String,
            Date: Date,
            Description: String,
            Categorie: String,
            Debit: Number,
            Credit: Number,
            Solde: Number
        })

        this.TransactionDB = mongooseDB.model('Transactions', transactionSchema);

        this.ImporterTransactionCSV("./epargne.csv");
        this.ImprimerTransactions();

    }


    /*-------------------------------------------------------------------------
    Méthode: ImporterTransactionCSV
    Description: 
    Lit une liste de transactions à partir d'un fichier CSV donné en paramètre 
    et l'enregistre dans la base de données.
	-------------------------------------------------------------------------*/
    ImporterTransactionCSV(nomFichierCsv) {
        console.log("Importation en cours fichier Csv" + nomFichierCsv);

        /*https://stackabuse.com/reading-and-writing-csv-files-with-node-js/*/
        const csv = require('csv-parser');
        const fs = require('fs');

        //Connexion à MongoDB
        const mongooseDB = require('mongoose');
        mongooseDB.connect('mongodb://localhost:27017/Budgets')
            .then(() => console.log('connected to mongodb'))
            .catch(err => console.error('could not connect to mongodb', err));

        //Lecture du fichier csv et ajout des transaction par rangées dans un array afin de verifier les dupliqués
        fs.createReadStream(nomFichierCsv)
            .pipe(csv())
            .on('data', (row) => {
                //Ici creer transaction (voir si schemamongoose ou mon objet)
                //Ici ajouter transaction dans array d'importation

                //let transaction = new Transaction(row['Date'], row['Description'], row['Categorie'], row['Debit'], row['Credit'], row['Solde']);
                //this.transactions.push(transaction);
            })
            .on('end', () => {
                console.log('CSV file successfully processed');
            });


        //Construire une Array de transactions candidates a partir du fichier csv
        //Ensuite parcourir cet array 
        //Regrouper par jour en un array
        //Pour chaque array par jour : si transactions sont d'un meme montant et meme jour
        //modifier String _id pour ajouter 1 puis 2 ... puis n

        //Cette approche ne fonctionnera pas si le fichier csv commence ou se termine par une journée ou une transaction
        //dupliquée est manquante, ce cas de figure me semble exceptionnel parce que les banques 
        //exportent toutes les transactions d'une journée complete

        //Ajouter dans la bd
        //Si Erreur d'ajout parce que clé dupliquée, 
        // on sait que c'est parce que cette partie du fichier CSV a été déja importée
        //  this.AjouterTransaction(row, mongooseDB);
    }

    /*-------------------------------------------------------------------------
    Méthode: AjouterTransaction
    Description: 
    Ajoute une transaction dans la bd
	-------------------------------------------------------------------------*/
    async AjouterTransaction(row, mongooseDB) {


        if (row['Date'] === null) return; //TODO vérifier dans fichier texte si n'est pas une ligne vide


        const transactionDB = new this.TransactionDB({
            _id: String(row['Date']) + String(row['Solde']),
            Date: row['Date'],
            Description: row['Description'],
            Categorie: row['Categorie'],
            Debit: row['Debit'],
            Credit: row['Credit'],
            Solde: row['Solde']
        })
        try {
            await transactionDB.save();
        } catch (erreur) {
            console.error("erreur ajouterTransaction:" + erreur);
        }

    }


    /*-------------------------------------------------------------------------
    Méthode: ImprimerTransactions
    Description: 
    Imprime la liste des transactions en mémoire sur la console
	-------------------------------------------------------------------------*/
    ImprimerTransactions() {
        /*      this.transactions.forEach(function (transaction) {
                 if (transaction !== null) {
                     transaction.Imprimer();
                 }
             }); */
    }
}


/*-------------------------------------------------------------------------
Classe: Transaction
Description: 
Classe utilitaire décrivant une transaction bancaire.
-------------------------------------------------------------------------*/
/* class Transaction {
    constructor(dateTransaction, description, categorie, debit, credit, solde) {
        this.key = dateTransaction + solde;
        this.dateTransaction = dateTransaction;
        this.description = description;
        this.categorie = categorie;
        this.debit = debit;
        this.credit = credit;
        this.solde = solde;
    }

    Imprimer() {
        console.log(`Transaction: ${this.key}, ${this.dateTransaction}, ${this.description}, ${this.categorie}, ${this.debit}, ${this.credit}, ${this.solde}`);
    }
} */