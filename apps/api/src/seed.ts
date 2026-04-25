import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(__dirname, '../../../database/agadham.sqlite');
const schemaPath = path.join(__dirname, '../../../database/schema.sql');
const dataPath = path.join(__dirname, '../../../NALAM VET TIME STAMP 11,11.4.txt');

const db = new Database(dbPath);

// Run schema
const schema = fs.readFileSync(schemaPath, 'utf-8');
db.exec(schema);

// Extract JSON array from the text file
console.log('Reading data...');
const content = fs.readFileSync(dataPath, 'utf-8');
const startIndex = content.indexOf('const DRUG_DB = [');
const endIndex = content.indexOf('];', startIndex) + 2;
const jsonStr = content.substring(startIndex, endIndex).replace('const DRUG_DB = ', '').replace(/;$/, '');

const drugsData = JSON.parse(jsonStr);
console.log(`Found ${drugsData.length} drugs.`);

const insertDrug = db.prepare(`
    INSERT OR REPLACE INTO drugs (
        id, generic_name, brand_names, category, species, indications, 
        contraindications, side_effects, route, formulation, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertRule = db.prepare(`
    INSERT OR REPLACE INTO drug_dosing_rules (
        id, drug_id, species, dose_text, notes
    ) VALUES (?, ?, ?, ?, ?)
`);

db.transaction(() => {
    for (const d of drugsData) {
        insertDrug.run(
            d.id,
            d.generic || '',
            d.brands || '',
            d.category || 'Miscellaneous',
            Array.isArray(d.species) ? d.species.join(',') : '',
            d.indications || '',
            d.contraindications || '',
            d.sideEffects || '', // Assuming potential future field
            d.route || '',
            d.formulation || '',
            d.notes || ''
        );

        // Add dosing rules for dogs and cats if available
        if (d.doseDog) {
            insertRule.run(d.id + '-dog', d.id, 'Dog', d.doseDog, '');
        }
        if (d.doseCat) {
            insertRule.run(d.id + '-cat', d.id, 'Cat', d.doseCat, '');
        }
        if (d.doseHorse) {
            insertRule.run(d.id + '-horse', d.id, 'Horse', d.doseHorse, '');
        }
    }
})();

console.log('Database seeded successfully!');
