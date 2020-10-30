
module.exports = class Transaction {

    /**
     * @constructor
     * @descriptionCreates an instance of transaction.
     */
    constructor() {

        this._id = "";              //a transaction ID built using other data
        this.date = new Date();     
        this.Description = "";
        this.Category = "";
        this.Amount = 0;            //Transaction amount negative or positive
        this.Balance = 0;           //Account balance if available
    }

   
    /**
     * SetTransaction
     * @description wrapper method that set transaction data and converts unsigned debit and credit
     *              to signed amount variable
     * 
     * @param {number} counter
     * @param {Date} date
     * @param {string} description
     * @param {string} category
     * @param {number} debit
     * @param {number} credit
     * @param {number} balance
     * @throws {Error} Paramètre invalid
     * 
     */
    SetTransaction(counter, date, description, category, debit, credit, balance) {

        //Colonnes débit et crédit sont combinées dans une colonne amount négatif ou positif
        const amount = credit > 0 ? credit : (-1 * debit);
        this.SetTransactionWithAmount(counter, date, description, category, amount, balance);
    }

    /**
     * SetTransactionWithAmount
     * @description Simple set of transaction data using an amount parameter instead of debit credit
     * 
     * @param {number} counter
     * @param {Date} date
     * @param {string} description
     * @param {string} category
     * @param {number} amount
     * @param {number} balance
     * @throws {Error} Paramètre invalide, s'ils ne répondent pas au schéma de validation.
     * 
     */
    SetTransactionWithAmount(counter, date, description, category, amount, balance) {
        
        this.date = date;
        this.Description = description;
        this.Category = category;
        this.Amount = amount;
        this.Balance = balance;

        this.SetTransactionID(counter);
    }

    /**
     * SetTransactionID
     * @description Méthode utilitaire, crée un ID de transaction par concaténation des parametres suivants:
     * 
     * @param {number} counter nombre entre 1 et 99 inclusivement
     * @throws {Error} si le counter est invalide
     */
    SetTransactionID(counter) {
        if (counter < 0 || counter > 99 || isNaN(counter) || counter === null) {
            throw new Error("SetTransactionID: Nouvelle transaction avec counter invalide");
        }

        let strcounter = "";
        counter < 10 ? strcounter = "0" + String(counter) : strcounter = String(counter);
        this._id = strcounter + String(this.date) + String(this.Description) + String(this.Amount);
    }

}






