const CompteBancaire = require('../CompteBancaire');

let compteBancaire = new CompteBancaire;

/*-------------------------------------------------------------------------
    Test: CreerIDTransaction
	-------------------------------------------------------------------------*/
describe('CreerIDTransaction', () => {
    it("Devrait creer une chaine ID qui commence par un compteur à 2 digits a partir d'un compteur entre 0 et 9 inclusivement", () => {
        const resultat = compteBancaire.CreerIDTransaction(1, "2020-01-14", "Transaction Test", 1);
        expect(resultat).toBe("012020-01-14Transaction Test1");
    });

    it("Devrait creer une chaine ID qui commence par un compteur à 2 digits a partir d'un compteur entre 10 et 99 inclusivement", () => {
        const resultat = compteBancaire.CreerIDTransaction(10, "2020-01-14", "Transaction Test", 1);
        expect(resultat).toBe("102020-01-14Transaction Test1");
    });

    it("Devrait lancer une erreur pour un compteur négatif", () => {
        expect(() => {
            compteBancaire.CreerIDTransaction(-1, "2020-01-14", "Transaction Test", 1).toThrow();
        });
    });

    it("Devrait lancer une erreur pour un compteur > 99", () => {
        expect(() => {
            compteBancaire.CreerIDTransaction(100, "2020-01-14", "Transaction Test", 1).toThrow();
        });
    });

});

/*-------------------------------------------------------------------------
    Test: CreerTransaction
	-------------------------------------------------------------------------*/
describe('CreerTransaction', () => {
    it("Devrait creer un objet transaction avec des parametres valides", () => {
        const resultat = compteBancaire.CreerTransaction(0, "2019-02-24", "Transaction Test", "Categorie", 1, 0, 10);
        expect(resultat._id).toBe("002019-02-24Transaction Test-1");
        expect(resultat.Date).toEqual(new Date("2019-02-24"));
        expect(resultat.Description).toBe("Transaction Test");
        expect(resultat.Categorie).toBe("Categorie");
        expect(resultat.Montant).toBe(-1);
        expect(resultat.Solde).toBe(10);
    });


    it("Devrait lancer une erreur pour une date invalide", () => {
        expect(() => {
            let transaction = compteBancaire.CreerTransaction(1, "Pas une date", "", "", 1, 0, 1).toThrow();
        });
    });
});