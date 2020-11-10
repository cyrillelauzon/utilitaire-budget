// @ts-nocheck
/*-------------------------------------------------------------------------
Class Transaction
Description: 
Encapsulation of a single bank Transaction
-------------------------------------------------------------------------*/
module.exports = class Transaction {

    #_id;
    #date;
    #description;
    #category;
    #amount;
    #balance;       //Account balance if available
    #owner;
    #tags;          //To be able to easily tag and group certain transactions : ex  holiday spendings...
    #counter;       //To manage duplicates of same day transactions


    /**
     * @constructor
     *Creates an instance of Transaction.
     * @param {string} date in a YYYY-MM-DD format /, - and space delimiters accepted
     * @param {string} dateFormat
     * @param {string} description
     * @param {string} category
     * @param {number} withdraw
     * @param {number} deposit
     * @param {string} owner
     * @param {string} tags
     * @param {number} [balance=undefined]
     * @param {number} [amount=undefined]
     * @param {number} [counter=0]
     * @throws error if parameters are invalid
     */
    constructor(date, dateFormat, description, category, withdraw, deposit, owner, tags, balance = undefined, amount = undefined, counter = 0) {

        this.#date = this.#ProcessDate(date, dateFormat);

        this.#description = description;
        this.#category = category;
        if (this.#category === "") { this.#category = "Aucune Catégorie"; }

        this.#amount = amount;
        if (amount === undefined) {
            this.#amount = withdraw > 0 ? withdraw : (-1 * deposit);
        }

        this.#balance = balance;
        this.#owner = owner;
        this.#tags = tags;

        this.#counter = counter;
        this.SetID(counter);
    }

    /**
     * @description
     * @returns {string}
     */
    GetID() { return this.#_id; }
    GetDate() { return this.#date; }
    GetDateString() {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return this.#date.toLocaleString(undefined, options);
    }
    GetDescription() { return this.#description; }
    GetCategory() { return this.#category; }
    GetAmount() { return this.#amount; }
    GetBalance() { return this.#balance; }
    GetOwner() { return this.#owner; }
    GetTags() { return this.#tags; }

 /**
     * @description
     * @returns {boolean}
     */
    IsEmpty() {
        return (this.#amount === 0 || isNaN(this.#amount))
    }

    /**
     * @description return true if transaction is an income
     * @returns {boolean}
     */
    IsIncome() {
        return this.#amount > 0;
    }


    /**
     * @description
     * @param {string} strDate the new date string
     * @param {string} dateFormat simple string delimited by - with YYYY-MM-DD in any order
     * @returns
     */
    #ProcessDate(strDate, dateFormat) {

        //Date format validation:
        //For simplicity: valid tokens are:(YYYY MM DD) Delimiter is -
        //NB: Regular expression does not test if all tokens are present ie YYYY-MM-MM would be valid
        if (/^(YYYY|MM|DD){1}-(YYYY|MM|DD){1}-(YYYY|MM|DD){1}$/.test(dateFormat) === false)
            throw new Error("Transaction: date format is invalid");

        let formatTokens = dateFormat.split("-");
        let counter = 0;
        let year = -1;
        let month = -1;
        let day = -1;
        for (let token of formatTokens) {
            if (token === "YYYY") year = counter;
            if (token === "MM") month = counter;
            if (token === "DD") day = counter;
            counter++;
        }
        if (year === -1 || month === -1 || day === -1) throw new Error("Transaction: missing year, month or day in date format");


        //Date validation:
        //Accepts space, / and - characters for date delimiters
        if (strDate.length != 10) throw new Error("Transaction: Date string length is invalid");
        if(/^\d{2,4}[\/ -]\d{2,4}[\/ -]\d{2,4}$/.test(strDate) === false) throw new Error("Transaction: Date string is invalid");
        
        
        //Validates date tokens:
        let dateTokens = strDate.split(/[\/ -]/);
        if (/^\d{4}$/.test(dateTokens[year]) === false) throw new Error("Transaction: date(year) is invalid");
        if (/^\d{2}$/.test(dateTokens[month]) === false) throw new Error("Transaction: date(month) is invalid");
        if (/^\d{2}$/.test(dateTokens[day]) === false) throw new Error("Transaction: date(day) is invalid");
        if (Number(dateTokens[month]) > 12 || Number(dateTokens[month]) <= 0 ) throw new Error("Transaction: month is invalid");
        if (Number(dateTokens[day]) > 31 || Number(dateTokens[day]) <= 0) throw new Error("Transaction: day is invalid");

        //Build date using the following format (javascript Date object requirement): YYYY-MM-DD
        let date = dateTokens[year] + "-" + dateTokens[month] + "-" + dateTokens[day];

        //Avoid JS date Quirk where date is equal to -1 day
        date += "T00:00:00";

        return new Date(date);
    }
   

    /**
     * @description Return a copy of current transaction object
     * @returns {Transaction}
     */
    Clone() {

        return new Transaction(this.#date,
            this.#description,
            this.#category, undefined, undefined,
            this.#owner,
            this.#tags,
            this.#balance,
            this.#amount,
            this.#counter);

        /* this.#date = transaction.#date;
        this.#description = transaction.#description;
        this.#category = transaction.#category;
        this.#amount = transaction.#amount;
        this.#balance = transaction.#balance;
        this.#owner = transaction.#owner;
        this.#tags = transaction.#tags;
        this.#_id = transaction.#_id; */
    }

    /**
     * SetID
     * @description  Builds a transaction ID by concatenation of the following parameters
     * 
     * @param {number} counter nombre entre 1 et 99 inclusivement
     * @throws {Error} si le counter est invalide
     */
    SetID(counter) {

        if (counter < 0 || counter > 99 || isNaN(counter) || counter === null) {
            throw new Error("Transaction.SetID(): Invalid counter for transaction");
        }

        //Padd counter to 2 digits:
        let strcounter = "";
        counter < 10 ? strcounter = "0" + String(counter) : strcounter = String(counter);
        this.#_id = String(this.GetDateString()) + String(this.#description) + String(this.#amount) + strcounter;
    }



}





