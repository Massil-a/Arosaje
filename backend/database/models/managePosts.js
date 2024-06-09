const path = require('path');
const sqlite = require('sqlite3').verbose();
const { handleDBOperation } = require('../../components/DreamTeamUtils');

const pathToDB = path.resolve(__dirname, '..', 'BASE.db');
const db = new sqlite.Database(pathToDB, sqlite.OPEN_READWRITE, (err) => {
    if (err) {
        return console.error('Erreur managePosts.js lors de la connexion à la BDD : \n', err);
    } else {
        console.log('Connecté au serveur SQL : managePosts.js');
    }
});

// CREER UN POST
const addPost = async (title, description, dateStart, dateEnd, address, cityName, idUser, idPlant) => {
    try {
        const sql = 'INSERT INTO Posts (title, description, dateStart, dateEnd, address, cityName, idUser, idPlant) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const result = await handleDBOperation((callback) => {
            db.run(sql, [title, description, dateStart, dateEnd, address, cityName, idUser, idPlant], function (err) {
                callback(err);
            });
        });
        console.log("Nouveau post créé , Titre : ",title)
        return { 
            status: 200, 
            success: true
        };
    } catch (e) {
        console.error('Erreur lors de la fonction addPost', e);
        return { 
            status: 400, 
            success: false 
        };
    }
};


// LIRE TOUS LES POSTS
const getAllPosts = async () => {
    try {
        const sql = 'SELECT * FROM Posts';
        const rows = await handleDBOperation((callback) => {
            db.all(sql, [], callback);
        });
        return { 
            body: rows, 
            status: 200, 
            success: true 
        };
    } catch (e) {
        console.error('Erreur lors de la fonction getAllPosts', e);
        return { 
            status: 400, 
            success: false 
        };
    }
};

module.exports = {
    addPost,
    getAllPosts
}