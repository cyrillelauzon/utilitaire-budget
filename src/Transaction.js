// @ts-nocheck
/*-------------------------------------------------------------------------
Class Transaction
Description: 
Encapsulation of a single bank Transaction
-------------------------------------------------------------------------*/

const Util = require('./Util');

module.exports = class Transaction {

    #_id;
    #date;
    #dateString;    //for cloning purposes
    #dateFormat;    //for cloning purposes
    #description;
    #category;
    #category_id;
    #amount;
    #balance;       //Account balance if available
    #owner;
    #tags;          //To be able to easily tag and group certain transactions : ex  holiday spendings...
    #counter;       //for cloning purposes
    #isapproved;

    //TODO #5 update transaction constructor
    /**
     *Creates an instance of Transaction.
     * @param {*} transactionData 
     */
    constructor(transactionData) {
        const { id, date, dateformat="YYYY-MM-DD", description, category, category_id = 0, deposit, withdraw, owner, tags, balance = undefined, amount = undefined, counter = 0, isapproved = false } = transactionData;
        this.#ProcessDate(date, dateformat);
        this.#dateFormat = dateformat;      //store for cloning purposes
        this.#dateString = date;            //store for cloning purposes

        this.#description = description;
        this.#category = category;
        this.#category_id = category_id;
        if (this.#category === "") { this.#category = "Aucune Catégorie"; }


        this.#ProcessAmount(deposit, withdraw, amount);

        this.#balance = balance;
        this.#owner = owner;
        this.#tags = tags;

        this.#counter = counter;
        this.#isapproved = isapproved;
        
        if(Util.isNullOrUndefined(id)) this.SetID(counter);
        else this.#_id = id;
    }

    
    /**
     * @description Return a copy of current transaction object
     * @returns {Transaction}
     */
    Clone() {
        
        let transactionData = {
            "date": this.#dateString,
            "dateformat": this.#dateFormat,
            "description": this.#description,
            "category": this.#category,
            "category_id": this.#category_id,
            "deposit": undefined, "withdraw": undefined,
            "owner": this.#owner,
            "tags": this.#tags,
            "balance": this.#balance,
            "amount": this.#amount,
            "counter": this.#counter,
            "isapproved": this.#isapproved
        }

        return new Transaction(transactionData);
    }



    /**
     * @description
     * @returns {string}
     */
    GetID() { return this.#_id; }
    IsApproved() { return this.#isapproved; }
    GetDate() { return this.#date; }
    GetDateString() {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return this.#date.toLocaleString(undefined, options);
    }

    GetDescription() { return this.#description; }

    SetCategory(category) { this.#category = category; }
    GetCategory() { return this.#category; }
    GetCategoryID() { return this.#category_id; }


    GetAmount() { return this.#amount; }
    GetBalance() { return this.#balance; }
    GetOwner() { return this.#owner; }
    GetTags() { return this.#tags; }

    /**
        * @description
        * @returns {boolean}
        */
    IsEmpty() {
        //FIXME test IsEmpty() in test suite or remove
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
     * @description Validate date format and date 
     * @param {*} strDate the new date string
     * @param {string} dateformat simple string delimited by - with YYYY-MM-DD in any order
     * @throws {Error} if format is invalid or for any error inside date string
     */
    #ProcessDate(strDate, dateformat) {

        //If date is already a date object, assign date to class member and skip all checks for string
        if (strDate instanceof Date) {
            this.#date = strDate;
            return;
        }

        //Verify if param is a valid string object
        if ((typeof strDate) !== 'string') throw new Error("Transaction: Date is not a String object");

        //Date format validation:
        //For simplicity: valid tokens are:(YYYY MM DD) Delimiter is -
        //NB: this regular expression does not tests if all tokens are present ie YYYY-MM-MM would be valid
        if (/^(YYYY|MM|DD){1}-(YYYY|MM|DD){1}-(YYYY|MM|DD){1}$/.test(dateformat) === false)
            throw new Error("Transaction: date format is invalid");

        let formatTokens = dateformat.split("-");
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
        if (/^\d{2,4}[\/ -]\d{2,4}[\/ -]\d{2,4}$/.test(strDate) === false) throw new Error("Transaction: Date string is invalid");


        //Validates date tokens:
        let dateTokens = strDate.split(/[\/ -]/);
        if (/^\d{4}$/.test(dateTokens[year]) === false) throw new Error("Transaction: date(year) is invalid");
        if (/^\d{2}$/.test(dateTokens[month]) === false) throw new Error("Transaction: date(month) is invalid");
        if (/^\d{2}$/.test(dateTokens[day]) === false) throw new Error("Transaction: date(day) is invalid");
        if (Number(dateTokens[month]) > 12 || Number(dateTokens[month]) <= 0) throw new Error("Transaction: month is invalid");
        if (Number(dateTokens[day]) > 31 || Number(dateTokens[day]) <= 0) throw new Error("Transaction: day is invalid");

        //Build date string using the following format (javascript Date object requirement): YYYY-MM-DD
        let date = dateTokens[year] + "-" + dateTokens[month] + "-" + dateTokens[day];

        //Avoid JS date Quirk where date is equal to -1 day
        date += "T00:00:00";

        this.#date = new Date(date);
    }

    /**
     * @description Process withdraw, deposit or amount. Store withdraw internally as amount with negative value
     * @param {number} withdraw 
     * @param {number} deposit
     * @param {number} amount Amount variable has precedence over withdraw and deposit
     */
    #ProcessAmount(deposit, withdraw, amount) {

        //Amount variable has precedence over withdraw and deposit
        if (!Util.isNullOrUndefined(amount)) {
            if (!Util.isNullOrUndefined(deposit)) throw new Error("Transaction: amount cannot be defined at same time of deposit");
            if (!Util.isNullOrUndefined(withdraw)) throw new Error("Transaction: amount cannot be defined at same time of withdraw");
            if (isNaN(amount)) throw new Error("Transaction: only numerical values are accepted for amount");
            this.#amount = Number(amount);
        }
        else {

            if (Util.isNullOrUndefined(deposit) && Util.isNullOrUndefined(withdraw)) {
                throw new Error("Transaction: neither withdraw, deposit or amount is defined" + amount);
            }

            if (isNaN(withdraw) || isNaN(deposit)) throw new Error("Transaction: only numerical values are accepted for withdraw or deposit");

            //Convert to Number to make sure that these variables passed as string are still read properly
            withdraw = Number(withdraw);
            deposit = Number(deposit);
            if (withdraw !== 0 && deposit !== 0) throw new Error("Transaction: withdraw and deposit cannot be defined at the same time");
            if (withdraw < 0 || deposit < 0) throw new Error("Transaction: withdraw or deposit cannot have a negative value");

            //Assign negative amount to withdraw to store internaly
            this.#amount = withdraw > 0 ? (-1 * Number(withdraw)) : Number(deposit);
        }
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






