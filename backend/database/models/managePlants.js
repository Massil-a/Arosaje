const path = require('path');
const sqlite = require('sqlite3').verbose();
const { handleDBOperation } = require('../../framework/DreamTeamUtils');

const pathToDB = path.resolve(__dirname, '..', 'BASE.db');
const db = new sqlite.Database(pathToDB, sqlite.OPEN_READWRITE, (err) => {
    if (err) {
        return console.error('Erreur managePlants.js lors de la connexion à la BDD : \n', err);
    } else {
        console.log('Connecté au serveur SQL : managePlants.js');
    }
});

// AJOUTER UNE PLANTE
const addPlant = async (description, origin, requirements, type) => {
    try {
        const sql = 'INSERT INTO Plants (description, origin, requirements, type) VALUES (?, ?, ?, ?)';
        await executeDBOperation(db, sql, [description, origin, requirements, type]);
        console.log("Nouvelle plante créée , Type : ",type)
        return { 
            message: "Plante créée!!!",
            status: 200, 
            success: true
        };
    } catch (e) {
        console.error('Erreur lors de la fonction addPlant', e);
        return { 
            status: 400, 
            success: false 
        };
    }
};

// GET PLANTE PAR ID
const getPlantWithID = async (plantID) => {
    try {
        if(plantID == undefined || plantID == null || plantID < 0 || !Number.isInteger(plantID)){
            return { 
                message:"ID incorrect",
                status: 400, 
                success: false 
            };
        }
        //const sql = 'SELECT idPlants, description, origin, requirements, type, idUser FROM Plants WHERE idPlants = ?';
        const sql = 'SELECT * FROM Plants';
        const result = await executeDBOperation(db, sql, [plantID], "all");
        if (result) {
            return { 
                body: result,
                status: 200, 
                success: true
            };
        } else {
            console.error('Aucune plante trouvée avec l\'ID :', plantID);
            return { 
                message: 'Plante non trouvée',
                status: 404, 
                success: false
            };
        }
    } catch (e) {
        console.error('Erreur lors de la fonction getPlantWithID', e);
        return { 
            status: 400, 
            success: false 
        };
    }
};

module.exports = {
    addPlant,
    getPlantWithID
}