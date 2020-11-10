// @ts-nocheck
const Transaction = require('../js/Transaction');


//Valid executions and parameters
describe('Correct date object creation ', () => {

    it("Should create a transaction with correct date object (date format: YYYY-MM-DD)", () => {
        const result = new Transaction("2019-02-24", "YYYY-MM-DD",
            "test description", "test category", 10, 0, "test owner", "test tags", 99, 
            undefined);

        expect(result.GetDateString()).toBe("2019-02-24");
    });

    it("Should create a transaction with correct date object (date format: MM-DD-YYYY)", () => {
        const result = new Transaction("02-24-2019", "MM-DD-YYYY",
            "test description", "test category", 10, 0, "test owner", "test tags", 99, 
            undefined);

        expect(result.GetDateString()).toBe("2019-02-24");
    });

    it("Should create a transaction with correct date object and different date delimiters (delimiters: space and /)", () => {
        const result = new Transaction("24 2019/02", "DD-YYYY-MM",
            "test description", "test category", 10, 0, "test owner", "test tags", 99, 
            undefined);

        expect(result.GetDateString()).toBe("2019-02-24");
    });
});


describe('Date format errors validations', () => {
    it("Should throw an error for date not following date Format (date format: YYYY-MM-DD)", () => {
        expect(() => {
            const result = new Transaction("24-2019-02", "YYYY-MM-DD",
            "test description", "test category", 10, 0, "test owner", "test tags", 99, 
            undefined);
        }).toThrow();
    });
    
    it("Should throw an error for repeating date format tokens (date format: YYYY-MM-MM)", () => {
        expect(() => {
            const result = new Transaction("24-2019-02", "YYYY-MM-MM",
            "test description", "test category", 10, 0, "test owner", "test tags", 99, 
            undefined);
        }).toThrow();
    });

    it("Should throw an error for improper date Format delimiter (date format: YYYY/MM-DD)", () => {
        expect(() => {
            const result = new Transaction("24-2019-02", "YYYY/MM-DDD",
            "test description", "test category", 10, 0, "test owner", "test tags", 99, 
            undefined);
        }).toThrow();
    });

    it("Should throw an error for invalid characters in date Format (date format: YYYY-MM-DT)", () => {
        expect(() => {
            const result = new Transaction("24-2019-02", "YYYY-MM-DT",
            "test description", "test category", 10, 0, "test owner", "test tags", 99, 
            undefined);
        }).toThrow();
    });

    it("Should throw an error for improper date Format length (date format: YYYY-MM-DDD)", () => {
        expect(() => {
            const result = new Transaction("24-2019-02", "YYYY-MM-DDD",
            "test description", "test category", 10, 0, "test owner", "test tags", 99, 
            undefined);
        }).toThrow();
    });
});


describe('Date strings errors validations', () => {
    it("Should throw an error for non-numeric characters in date (2019-3a-02)", () => {
        expect(() => {
            const result = new Transaction("2019-3a-02", "YYYY-MM-DD",
            "test description", "test category", 10, 0, "test owner", "test tags", 99, 
            undefined);
        }).toThrow();
    });

    it("Should throw an error for improper date string length (2019-31-022)", () => {
        expect(() => {
            const result = new Transaction("2019-31-022", "YYYY-MM-DD",
            "test description", "test category", 10, 0, "test owner", "test tags", 99, 
            undefined);
        }).toThrow();
    });

    it("Should throw an error for month out of bound (2019-32-02)", () => {
        expect(() => {
            const result = new Transaction("2019-32-02", "YYYY-MM-DD",
            "test description", "test category", 10, 0, "test owner", "test tags", 99, 
            undefined);
        }).toThrow();
    });

    it("Should throw an error for day out of bound (2019-31-00)", () => {
        expect(() => {
            const result = new Transaction("2019-31-00", "YYYY-MM-DD",
            "test description", "test category", 10, 0, "test owner", "test tags", 99, 
            undefined);
        }).toThrow();
    });


});



describe('Transaction amounts validations', () => {
    it("Should create a transaction with correct negative Amount (-100)", () => {
        const result = new Transaction("2019-24-02", "YYYY-DD-MM",
            "test description", "test category", "", null, "test owner", "test tags", 99, 
            -100);

        expect(result.GetAmount()).toBe(-100);
    });

    it("Should create a transaction with correct positive Amount (100)", () => {
        const result = new Transaction("2019-24-02", "YYYY-DD-MM",
            "test description", "test category", 0, undefined, "test owner", "test tags", 99, 
            100);

        expect(result.GetAmount()).toBe(100);
    });

    it("Should create a transaction with correct Withdraw (-10) (amount param undefined)", () => {
        const result = new Transaction("2019-24-02", "YYYY-DD-MM",
            "test description", "test category", 0, 10, "test owner", "test tags", 99, 
            undefined);

        expect(result.GetAmount()).toBe(-10);
    });

    it("Should create a transaction with correct Deposit(10) (amount param undefined)", () => {
        const result = new Transaction("2019-24-02", "YYYY-DD-MM",
            "test description", "test category", 10, 0, "test owner", "test tags", 99, 
            undefined);

        expect(result.GetAmount()).toBe(10);
    });


    //Errors validations
    it("Should throw an error if Amount is not a number", () => {
        expect(() => {
            const result = new Transaction("2019-12-02", "YYYY-MM-DD",
            "test description", "test category", 0, 0, "test owner", "test tags", 99, "NotaNumber");
        }).toThrow();
    });

    it("Should throw an error if Deposit, Withdraw and Amount are undefined", () => {
        expect(() => {
            const result = new Transaction("2019-12-02", "YYYY-MM-DD",
            "test description", "test category", "", undefined, "test owner", "test tags", 99);
        }).toThrow();
    });

    it("Should throw an error if Amount is defined at same time of withdraw", () => {
        expect(() => {
            const result = new Transaction("2019-12-02", "YYYY-MM-DD",
            "test description", "test category", 10, null, "test owner", "test tags", 99
            -150);
        }).toThrow();
    });

    it("Should throw an error if Amount is defined at same time of deposit", () => {
        expect(() => {
            const result = new Transaction("2019-12-02", "YYYY-MM-DD",
            "test description", "test category", "", 10, "test owner", "test tags", 99
            -150);
        }).toThrow();
    });

    it("Should throw an error if both Deposit and Withdraw are != 0", () => {
        expect(() => {
            const result = new Transaction("2019-12-02", "YYYY-MM-DD",
            "test description", "test category", 10, 10, "test owner", "test tags", 99);
        }).toThrow();
    });

    it("Should throw an error if Deposit or Withdraw is not a number (undefined is ok)", () => {
        expect(() => {
            const result = new Transaction("2019-12-02", "YYYY-MM-DD",
            "test description", "test category", "NotaNumber", 10, "test owner", "test tags", 99);
        }).toThrow();
    });

    it("Should throw an error if Withdraw is < 0", () => {
        expect(() => {
            const result = new Transaction("2019-12-02", "YYYY-MM-DD",
            "test description", "test category", -10, 0, "test owner", "test tags", 99);
        }).toThrow();
    });

    it("Should throw an error if Deposit is < 0", () => {
        expect(() => {
            const result = new Transaction("2019-12-02", "YYYY-MM-DD",
            "test description", "test category", 0, -10, "test owner", "test tags", 99);
        }).toThrow();
    });


});

describe('Transaction ID validations', () => {
    it("Should create a transaction with correct id where counter = 0 (2019-02-24test description-10000)", () => {
        const result = new Transaction("2019-24-02", "YYYY-DD-MM",
            "test description", "test category", "", null, "test owner", "test tags", 99, 
            -100);

        expect(result.GetID()).toBe("2019-02-24test description-10000");
    });

    it("Should create a transaction with correct id where counter = 3 (2019-02-24test description-10003)", () => {
        const result = new Transaction("2019-24-02", "YYYY-DD-MM",
            "test description", "test category", "", null, "test owner", "test tags", 99, 
            -100, 3);

        expect(result.GetID()).toBe("2019-02-24test description-10003");
    });

    it("Should throw an error if counter is out of bound (<0)", () => {
        expect(() => {
            const result = new Transaction("2019-12-02", "YYYY-MM-DD",
            "test description", "test category", 0, -10, "test owner", "test tags", 99,
            -100, -1);
        }).toThrow();
    });

    it("Should throw an error if counter is out of bound (>99)", () => {
        expect(() => {
            const result = new Transaction("2019-12-02", "YYYY-MM-DD",
            "test description", "test category", 0, -10, "test owner", "test tags", 99,
            -100, 133);
        }).toThrow();
    });

    it("Should throw an error if counter is not a number", () => {
        expect(() => {
            const result = new Transaction("2019-12-02", "YYYY-MM-DD",
            "test description", "test category", 0, -10, "test owner", "test tags", 99,
            -100, "NotANumber");
        }).toThrow();
    });

});


describe('Transaction object cloning tests', () => {
    it("A cloned transaction should properly copy all class members", () => {
        let transactionA = new Transaction("2019-24-02", "YYYY-DD-MM",
            "test description", "test category", "", null, "test owner", "test tags", 99, 
            -100, 3);
        let transactionB = transactionA.Clone();
        
        expect(transactionB.GetDateString()).toBe("2019-02-24");
        expect(transactionB.GetDescription()).toBe("test description");
        expect(transactionB.GetCategory()).toBe("test category");
        expect(transactionB.GetAmount()).toBe(-100);
        expect(transactionB.GetOwner()).toBe("test owner");
        expect(transactionB.GetTags()).toBe("test tags");
        expect(transactionB.GetBalance()).toBe(99);
        expect(transactionB.GetID()).toBe("2019-02-24test description-10003");
    });

    //Only verifying if ID is changed since
    //by design it's not possible to modify a transaction onced it's created
    it("A cloned transaction ID should not be modified if original transaction ID is altered", () => {
        let transactionA = new Transaction("2019-24-02", "YYYY-DD-MM",
            "test description", "test category", "", null, "test owner", "test tags", 99, 
            -100, 3);
        let transactionB = transactionA.Clone();
        

        transactionB.SetID(30);
        expect(transactionA.GetID()).toBe("2019-02-24test description-10003");
    });


});