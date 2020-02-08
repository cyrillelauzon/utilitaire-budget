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
        this.transactions = new Map();
        this.type = "type"; //personnel, celi, crédit...
        this.description = "description"; //Description de lutilisateur
        this.nom = "nom"; //nom du compte
        this.proprietaire = "proprietaire"; //proprio du compte


        //Création d'un schema de transaction Mangoose
        //NB: Montant négatif = Crédit, Montant Positif = Débit
        const mongooseDB = require('mongoose');
        const transactionSchema = new mongooseDB.Schema({
            _id: String,
            Date: Date,
            Description: String,
            Categorie: String,
            Montant: Number,
            Solde: Number
        })
        this.TransactionDB = mongooseDB.model('Transactions', transactionSchema);


        this.ImporterTransactionCSV("./epargne.csv");
        //this.ImprimerTransactions();
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

        //Lecture du fichier csv 
        //ajout des transaction par rangées dans transactions afin de verifier les dupliqués
        fs.createReadStream(nomFichierCsv)
            .pipe(csv())
            .on('data', (row) => {

                let transaction = this.CreerTransaction(0, row['Date'], row['Description'], row['Categorie'], row['Debit'], row['Credit'], row['Solde']);
                if (transaction !== undefined) {
                    this.AjouterTransaction(transaction);
                }

            })
            .on('end', () => {
                console.log('CSV file successfully processed');

                //              this.ImprimerTransactions();
            });

    }

    /*-------------------------------------------------------------------------
    Méthode: CreerTransaction
    Description: 
    Creer un objet transaction Mongoose en validant si l'objet n'est pas vide.
    //TODO retourne null si ligne du fichier csv est vide.
	-------------------------------------------------------------------------*/
    CreerTransaction(compteur, date, description, categorie, debit, credit, solde) {

        //Colonnes débit et crédit sont combinées dans une colonne montant négatif ou positif
        const montant = credit > 0 ? credit : (-1 * debit);
        return this.CreerTransaction(compteur, date, description, categorie, montant, solde);
    }

    /*-------------------------------------------------------------------------
    Méthode: CreerTransaction
    Description: 
    Creer un objet transaction Mongoose en validant si l'objet n'est pas vide.
    //TODO retourne null si ligne du fichier csv est vide.
	-------------------------------------------------------------------------*/
    CreerTransaction(compteur, date, description, categorie, montant, solde) {

        //TODO Valider si n'est pas Transaction vide et retourner null
        let transaction = new this.TransactionDB({
            _id: this.CreerIDTransaction(compteur, date, description, montant),
            Date: date,
            Description: description,
            Categorie: categorie,
            Montant: montant,
            Solde: solde
        })

        return transaction;
    }

    /*-------------------------------------------------------------------------
    Méthode: CreerIDTransaction
    Description: 
	-------------------------------------------------------------------------*/
    CreerIDTransaction(compteur, date, description, montant) {
        let strCompteur = "";
        compteur < 10 ? strCompteur = "0" + String(compteur) : strCompteur = String(compteur);
        return strCompteur + String(date) + String(description) + String(montant);
    }


    /*-------------------------------------------------------------------------
        Méthode: AjouterTransaction
        Description: 
        Ajoute une transaction dans la bd
    	-------------------------------------------------------------------------*/
    AjouterTransaction(transaction) {

        
        let compteur = 0;
        let strID = transaction._id;
        let creerNouvelleTransaction = false;
        
        //remplacer this.transaction.has par lecture dans bd
        while (this.transactions.has(strID) === true) {
            creerNouvelleTransaction = true;
            compteur += 1;
            strID = this.CreerIDTransaction(compteur, transaction.Date, transaction.Description, transaction.Montant);
        }

        if (creerNouvelleTransaction === true) {
            transaction = this.CreerTransaction(compteur, transaction.Date, transaction.Description, transaction.Categorie, transaction.Montant, transaction.Solde);
            console.log("Ajout Transaction: " + transaction);
        }

        //Ajout dans une pile pour verifier si transaction n'existe pas deja
        this.transactions.set(transaction._id, transaction);
        
        try {
            await transaction.save();
        } catch (erreur) {
            //console.error("erreur ajouterTransaction:" + erreur);
        }
    }


    /*-------------------------------------------------------------------------
        Méthode: ImprimerTransactions
        Description: 
        Imprime la liste des transactions en mémoire sur la console
    	-------------------------------------------------------------------------*/
    ImprimerTransactions() {
        this.transactions.forEach(function (transaction) {
            if (transaction !== null) {
                console.log("Transaction: " + transaction);
            }
        });
    }
}
