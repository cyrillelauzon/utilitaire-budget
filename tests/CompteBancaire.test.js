// @ts-nocheck
const BankAccount = require('../BankAccount');

let bankAccount = new BankAccount;


/*-------------------------------------------------------------------------
    Test: ImportTransactionsCSV
	-------------------------------------------------------------------------*/
describe('ImportTransactionsCSV', () => {

    it("Devrait lancer une exception pour un fichier inexistant", () => {
        expect(() => {
            bankAccount.ImportTransactionsCSV("Mauvais nom de fichier");
        }).toThrow();
    });


});

/*-------------------------------------------------------------------------
    Test: CreerIDTransaction
	-------------------------------------------------------------------------*/
describe('CreerIDTransaction', () => {
    it("Devrait creer une chaine ID qui commence par un compteur à 2 digits a partir d'un compteur entre 0 et 9 inclusivement", () => {
        const resultat = bankAccount.CreerIDTransaction(1, "2020-01-14", "Transaction Test", 1);
        expect(resultat).toBe("012020-01-14Transaction Test1");
    });

    it("Devrait creer une chaine ID qui commence par un compteur à 2 digits a partir d'un compteur entre 10 et 99 inclusivement", () => {
        const resultat = bankAccount.CreerIDTransaction(10, "2020-01-14", "Transaction Test", 1);
        expect(resultat).toBe("102020-01-14Transaction Test1");
    });

    it("Devrait lancer une exception pour un compteur négatif", () => {
        expect(() => {
            bankAccount.CreerIDTransaction(-1, "2020-01-14", "Transaction Test", 1)
        }).toThrow();
    });

    it("Devrait lancer une exception pour un compteur > 99", () => {
        expect(() => {
            bankAccount.CreerIDTransaction(100, "2020-01-14", "Transaction Test", 1)
        }).toThrow();
    });

    it("Devrait lancer une exception pour un compteur string", () => {
        expect(() => {
            bankAccount.CreerIDTransaction("testString", "2020-01-14", "Transaction Test", 1)
        }).toThrow();
    });

    it("Devrait lancer une exception pour un compteur null", () => {
        expect(() => {
            bankAccount.CreerIDTransaction(null, "2020-01-14", "Transaction Test", 1)
        }).toThrow();
    });


    // 
});




/*-------------------------------------------------------------------------
    Test: CreerTransaction
	-------------------------------------------------------------------------*/
describe('CreerTransaction', () => {
    it("Devrait creer un objet transaction avec des parametres valides", () => {
        const resultat = bankAccount.CreerTransaction(0, "2019-02-24", "Transaction Test", "Categorie", 1, 0, 10);

        expect(resultat._id).toBe("002019-02-24Transaction Test-1");
        expect(resultat.Date).toEqual(new Date("2019-02-24"));
        expect(resultat.Description).toBe("Transaction Test");
        expect(resultat.Categorie).toBe("Categorie");
        expect(resultat.Montant).toBe(-1);
        expect(resultat.Solde).toBe(10);
    });

    it("Devrait lancer une exception pour une date invalide", () => {
        expect(() => {
            bankAccount.CreerTransaction(1, "Pas une date", "", "", 1, 0, 1)
        }).toThrow();
    });

    it("Devrait lancer une exception pour compteur invalide", () => {
        expect(() => {
            bankAccount.CreerTransaction("", "2019-02-04", "", "", 1, 0, 1)
        }).toThrow();
    });

    it("Devrait lancer une exception pour un débit invalide", () => {
        expect(() => {
            bankAccount.CreerTransaction(1, "2019-02-04", "", "", null, 0, 1)
        }).toThrow();
    });

    it("Devrait lancer une exception pour un crédit invalide", () => {
        expect(() => {
            bankAccount.CreerTransaction(1, "2019-02-04", "", "", 0, undefined, 1)
        }).toThrow();
    });

    it("Devrait lancer une exception pour un solde invalide", () => {
        expect(() => {
            bankAccount.CreerTransaction(1, "2019-02-04", "", "", 0, 1, null)
        }).toThrow();
    });

});