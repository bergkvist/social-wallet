import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL);
const db = { sequelize, Sequelize };

/**
 * Find all relevant files in the models folder, and import them
 * as sequelize models.
 */
fs.readdirSync(__dirname)
    .filter(file => {
        const notDotFile = (file.indexOf('.') !== 0);
        const notThisFile = (file !== path.basename(__filename));
        const jsFile = (file.slice(-3) === '.js');

        return notDotFile && notThisFile && jsFile;
    })
    .forEach(file => {
        const model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

/**
 * Now that all the models have already been added, 
 * the associations can be created, and the scopes can be added:
 */
Object.keys(db).forEach(modelName => {
    const model = db[modelName];
    if (model.associate)      model.associate(db);
    if ('addScopes' in model) model.addScopes(db);
});

export default db;

