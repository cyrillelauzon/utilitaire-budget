/*-------------------------------------------------------------------------
Class Transaction
Description: 
Encapsulation of a single bank Transaction
-------------------------------------------------------------------------*/
module.exports = class Transaction {

    /**
     * @constructor
     * @descriptionCreates an instance of transaction.
     */
    constructor() {

        this._id = "";              //a transaction ID built using other data
        this.date = undefined;     
        this.Description = "";
        this.Category = "";
        this.Amount = 0;            //Transaction amount negative or positive
        this.Balance = 0;           //Account balance if available
        
        this.Owner = "";        
        this.Tags = "";            //To be able to easily tag and group certain transactions : ex  holiday spendings...
    }

    /**
     * @description
     * @returns {string}
     */
    GetID(){ return this._id;}
   

    /**
     * @description
     * @returns {boolean}
     */
    IsEmpty(){
        return (this.Amount===0 || isNaN(this.Amount))
    }

    /**
     * @description return true if transaction is an income
     * @returns {boolean}
     */
    IsIncome(){
        return this.Amount > 0;
    }

    /**
     * SetTransaction
     * @description wrapper method that set transaction data and converts unsigned debit and credit
     *              to signed amount variable
     * 
     * @param {array} newTransaction information
     * @param {number} counter
     * @throws {Error} Paramètre invalid
     * 
     */
    SetTransaction(newTransaction, counter=0) {

        //Colonnes débit et crédit sont combinées dans une colonne amount négatif ou positif
        const amount = newTransaction['Withdraw'] > 0 ? newTransaction['Withdraw'] : (-1 * newTransaction['Deposit']);
        newTransaction['Amount'] = amount;
        this.SetTransactionWithAmount(newTransaction, counter);
    }


    /**
     * SetTransactionWithAmount
     * @description Simple set of transaction data using an amount parameter instead of debit credit
     * 
     * @param {array} newTransaction information
     * @param {number} counter
     * @throws {Error} Paramètre invalide, s'ils ne répondent pas au schéma de validation.
     * 
     */
    SetTransactionWithAmount(newTransaction, counter=0) {
        
        this.date = newTransaction['date'];
        
        this.Description = newTransaction['Description'];
        this.Category  = newTransaction['Category'];
        if(this.Category === ""){ this.Category="Aucune Catégorie";}

        this.Amount = newTransaction['Amount'];
        this.Balance = newTransaction['Balance'];
        this.Owner = newTransaction['Owner'];
        this.Tags = newTransaction['Tags'];

        this.SetTransactionID(counter);
    }


    /**
     * @description
     * @param {Transaction} transaction
     */
    CopyTransaction(transaction){
        this.date = transaction.date;
        this.Description = transaction.Description;
        this.Category = transaction.Category;
        this.Amount = transaction.Amount;
        this.Balance = transaction.Balance;
        this.Owner = transaction.Owner;
        this.Tags = transaction.Tags;
        this._id = transaction._id;
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
        newTransactionID =  String(date) + String(description) + String(amount) + strcounter;

        return newTransactionID;
    }

}






