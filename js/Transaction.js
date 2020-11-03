
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

    GetID(){ return this._id;}
   
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
     * @description  Builds a transaction ID by concatenation of the following parameters
     * 
     * @param {number} counter nombre entre 1 et 99 inclusivement
     * @throws {Error} si le counter est invalide
     */
    SetTransactionID(counter) {
        this._id = Transaction.BuildTransactionID(counter, this.date, this.Description, this.Amount);
    }


    /**
     * @description Builds a new TransactionID
     * @static
     * @param {number} counter
     * @param {Date} date
     * @param {string} description
     * @param {number} amount
     * @returns
     */
    static BuildTransactionID(counter, date, description, amount){
        let newTransactionID = "";

        if (counter < 0 || counter > 99 || isNaN(counter) || counter === null) {
            throw new Error("BuildTransactionID: Invalid counter for new transaction");
        }

        //Padd counter to 2 digits:
        let strcounter = "";
        counter < 10 ? strcounter = "0" + String(counter) : strcounter = String(counter);
        newTransactionID = strcounter + String(date) + String(description) + String(amount);

        return newTransactionID;
    }

}






