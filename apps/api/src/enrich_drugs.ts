import db from './db';

// ============================================================
// STRUCTURED DRUG ENRICHMENT - Top 50 Common Clinic Drugs
// Adds: mg_per_kg, frequency_hours, duration_days,
//       concentration_mg, concentration_ml to existing records
// Source: Plumb's Veterinary Drug Handbook (8th Ed) + standard references
// ============================================================

const updateDrug = db.prepare(`
    UPDATE drugs SET concentration_mg = ?, concentration_ml = ? WHERE id = ?
`);

const upsertRule = db.prepare(`
    INSERT OR REPLACE INTO drug_dosing_rules
        (id, drug_id, species, mg_per_kg, frequency_hours, duration_days, dose_text, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

// Structure: [drug_id, concentration_mg, concentration_ml]
const drugConcentrations: [string, number, number][] = [
    ['OLD-8',   875,  1],   // Amoxicillin/Clavulanate 875mg tablet
    ['OLD-34',  500,  1],   // Cephalexin 500mg capsule
    ['OLD-69',  50,   1],   // Enrofloxacin 50mg/ml injectable
    ['NEW-4',   50,   1],   // Enrofloxacin 50mg/ml
    ['OLD-67',  100,  1],   // Doxycycline 100mg tablet
    ['OLD-43',  500,  1],   // Ciprofloxacin 500mg tablet
    ['OLD-190', 48,   1],   // TMP/Sulfa 48mg/ml oral suspension
    ['OLD-4',   50,   1],   // Amikacin 50mg/ml injectable
    ['OLD-27',  330,  1],   // Cefazolin 330mg/ml reconstituted
    ['OLD-139', 200,  1],   // Oxytetracycline 200mg/ml injectable
    ['OLD-55',  4,    1],   // Dexamethasone 4mg/ml injectable
    ['OLD-16',  6,    1],   // Betamethasone 6mg/ml injectable
    ['OLD-152', 5,    1],   // Prednisolone 5mg tablet
    ['OLD-54',  5,    1],   // Dexamethasone sodium phosphate 5mg/ml
    ['OLD-84',  50,   1],   // Furosemide 50mg/ml injectable
    ['OLD-70',  1,    1],   // Epinephrine 1mg/ml (1:1000)
    ['OLD-61',  0.25, 1],   // Digoxin 0.25mg tablet
    ['OLD-101', 10,   1],   // Ivermectin 10mg/ml (1%) injectable
    ['NEW-1',   10,   1],   // Ivermectin 10mg/ml
    ['OLD-77',  222,  1],   // Fenbendazole 222mg/g paste
    ['NEW-2',   100,  1],   // Fenbendazole 100mg/ml suspension
    ['OLD-2',   400,  1],   // Albendazole 400mg tablet
    ['OLD-114', 500,  1],   // Mebendazole 500mg tablet
    ['OLD-105', 200,  1],   // Ketoconazole 200mg tablet
    ['OLD-100', 100,  1],   // Itraconazole 100mg capsule
    ['OLD-9',   50,   1],   // Amphotericin B 50mg vial
    ['OLD-38',  4,    1],   // Chlorpheniramine 4mg tablet
    ['OLD-93',  25,   1],   // Hydroxyzine 25mg tablet
    ['OLD-218', 10,   1],   // Cetirizine 10mg tablet
    ['OLD-103', 100,  1],   // Ketamine 100mg/ml injectable
    ['NEW-10',  25,   1],   // Acepromazine 25mg/ml injectable
    ['NEW-8',   100,  1],   // Xylazine 100mg/ml injectable
    ['OLD-108', 20,   1],   // Lidocaine 20mg/ml (2%) injectable
    ['OLD-148', 50,   1],   // Pentobarbital 50mg/ml injectable
    ['OLD-144', 300000, 1], // Penicillin G 300,000 IU/ml
    ['OLD-146', 300000, 1], // Penicillin G Procaine 300,000 IU/ml
    ['OLD-62',  500,  1],   // Dihydrostreptomycin 500mg/ml
    ['OLD-170', 60,   1],   // Selamectin 60mg/ml spot-on
    ['OLD-121', 2.3,  1],   // Milbemycin oxime 2.3mg tablet
    ['OLD-76',  50,   1],   // Febantel+Praziquantel+Pyrantel combo
    ['OLD-223', 0.4,  1],   // Naloxone 0.4mg/ml injectable
    ['OLD-143', 250,  1],   // D-Penicillamine 250mg capsule
    ['OLD-175', 400,  1],   // Sulfadimethoxine 400mg tablet
];

// Structure: [rule_id, drug_id, species, mg_per_kg, freq_hours, duration_days, dose_text, notes]
const structuredRules: [string, string, string, number, number, number, string, string][] = [
    // --- ANTIBIOTICS ---
    ['OLD-8-dog-s',   'OLD-8',  'Dog',   12.5, 12, 7,  '12.5–25 mg/kg q12h PO', 'Amoxicillin/Clavulanate'],
    ['OLD-8-cat-s',   'OLD-8',  'Cat',   12.5, 12, 7,  '12.5–25 mg/kg q12h PO', 'Amoxicillin/Clavulanate'],
    ['OLD-34-dog-s',  'OLD-34', 'Dog',   15,   12, 7,  '15–30 mg/kg q12h PO', 'Cephalexin'],
    ['OLD-34-cat-s',  'OLD-34', 'Cat',   15,   12, 7,  '15–30 mg/kg q12h PO', 'Cephalexin'],
    ['OLD-69-dog-s',  'OLD-69', 'Dog',   5,    24, 7,  '5–20 mg/kg q24h PO/SC/IM', 'Enrofloxacin'],
    ['OLD-69-cat-s',  'OLD-69', 'Cat',   5,    24, 7,  '5 mg/kg q24h PO (caution: retinal toxicity)', 'Enrofloxacin - use with caution'],
    ['NEW-4-dog-s',   'NEW-4',  'Dog',   5,    24, 7,  '5–20 mg/kg q24h SC/IM', 'Enrofloxacin injectable'],
    ['NEW-4-cattle-s','NEW-4',  'Cattle',7.5,  24, 5,  '7.5 mg/kg q24h SC', 'Enrofloxacin cattle dose'],
    ['OLD-67-dog-s',  'OLD-67', 'Dog',   5,    12, 14, '5–10 mg/kg q12h PO', 'Doxycycline'],
    ['OLD-67-cat-s',  'OLD-67', 'Cat',   5,    12, 14, '5–10 mg/kg q12h PO', 'Doxycycline - always with food/water'],
    ['OLD-43-dog-s',  'OLD-43', 'Dog',   10,   12, 7,  '10–15 mg/kg q12h PO', 'Ciprofloxacin'],
    ['OLD-43-cat-s',  'OLD-43', 'Cat',   5,    12, 7,  '5–15 mg/kg q12h PO', 'Ciprofloxacin'],
    ['OLD-190-dog-s', 'OLD-190','Dog',   15,   12, 14, '15–30 mg/kg q12h PO', 'TMP/Sulfa'],
    ['OLD-190-cat-s', 'OLD-190','Cat',   15,   12, 14, '15 mg/kg q12h PO', 'TMP/Sulfa'],
    ['OLD-4-dog-s',   'OLD-4',  'Dog',   10,   8,  7,  '10 mg/kg q8h IV/SC', 'Amikacin - monitor renal function'],
    ['OLD-4-cat-s',   'OLD-4',  'Cat',   10,   8,  7,  '10 mg/kg q8h IV/SC', 'Amikacin - monitor renal function'],
    ['OLD-27-dog-s',  'OLD-27', 'Dog',   20,   8,  7,  '20–35 mg/kg q8h IV/IM', 'Cefazolin'],
    ['OLD-27-cat-s',  'OLD-27', 'Cat',   20,   8,  7,  '20 mg/kg q8h IV/IM', 'Cefazolin'],
    ['OLD-139-dog-s', 'OLD-139','Dog',   10,   24, 7,  '10–20 mg/kg q24h IM/SC', 'Oxytetracycline LA'],
    ['OLD-139-cattle-s','OLD-139','Cattle',20,  72, 5,  '20 mg/kg q72h IM (LA formulation)', 'Oxytetracycline cattle'],
    ['OLD-144-dog-s', 'OLD-144','Dog',   22000, 12, 7, '22,000 IU/kg q12h IM/SC', 'Penicillin G benzyl'],
    ['OLD-146-dog-s', 'OLD-146','Dog',   22000, 24, 5, '22,000 IU/kg q24h IM', 'Penicillin G procaine'],
    ['OLD-146-cattle-s','OLD-146','Cattle',22000,24,5, '22,000 IU/kg q24h IM', 'Penicillin G procaine cattle'],
    // --- CORTICOSTEROIDS ---
    ['OLD-55-dog-s',  'OLD-55', 'Dog',   0.1,  24, 5,  '0.1–0.5 mg/kg q24h IM/IV/SC/PO (anti-inflammatory)', 'Dexamethasone'],
    ['OLD-55-cat-s',  'OLD-55', 'Cat',   0.1,  24, 5,  '0.1–0.5 mg/kg q24h IM/IV', 'Dexamethasone'],
    ['OLD-55-cattle-s','OLD-55','Cattle',0.05, 24, 3,  '0.05–0.1 mg/kg IM/IV for shock', 'Dexamethasone cattle'],
    ['OLD-16-dog-s',  'OLD-16', 'Dog',   0.2,  24, 3,  '0.2 mg/kg IM q24h', 'Betamethasone'],
    ['OLD-152-dog-s', 'OLD-152','Dog',   1,    12, 7,  '1–2 mg/kg q12h PO (anti-inflammatory)', 'Prednisolone'],
    ['OLD-152-cat-s', 'OLD-152','Cat',   1,    12, 7,  '1–2 mg/kg q12h PO', 'Prednisolone'],
    // --- CARDIOVASCULAR ---
    ['OLD-84-dog-s',  'OLD-84', 'Dog',   2,    12, 0,  '2–4 mg/kg q12h PO/IM/IV', 'Furosemide'],
    ['OLD-84-cat-s',  'OLD-84', 'Cat',   1,    12, 0,  '1–4 mg/kg q12h PO/IM/IV', 'Furosemide'],
    ['OLD-70-dog-s',  'OLD-70', 'Dog',   0.01, 0,  0,  '0.01 mg/kg IV/IM/SC - emergency use', 'Epinephrine 1:1000'],
    ['OLD-70-cat-s',  'OLD-70', 'Cat',   0.01, 0,  0,  '0.01 mg/kg IV/IM - emergency use', 'Epinephrine 1:1000'],
    ['OLD-61-dog-s',  'OLD-61', 'Dog',   0.005,12, 0,  '0.005–0.01 mg/kg q12h PO - TDM recommended', 'Digoxin'],
    // --- ANTIPARASITICS ---
    ['OLD-101-dog-s', 'OLD-101','Dog',   0.2,  720,30, '0.2–0.4 mg/kg q30d SC (heartworm prevention)', 'Ivermectin'],
    ['NEW-1-cattle-s','NEW-1',  'Cattle',0.2,  168,1,  '0.2 mg/kg SC once (pour-on: 0.5 mg/kg)', 'Ivermectin cattle'],
    ['NEW-1-sheep-s', 'NEW-1',  'Sheep', 0.2,  168,1,  '0.2 mg/kg SC once', 'Ivermectin sheep'],
    ['NEW-1-pig-s',   'NEW-1',  'Pig',   0.3,  168,1,  '0.3 mg/kg SC once', 'Ivermectin pig'],
    ['OLD-77-dog-s',  'OLD-77', 'Dog',   50,   24, 3,  '50 mg/kg q24h for 3 days PO', 'Fenbendazole'],
    ['OLD-77-cat-s',  'OLD-77', 'Cat',   50,   24, 5,  '50 mg/kg q24h for 5 days PO', 'Fenbendazole'],
    ['NEW-2-cattle-s','NEW-2',  'Cattle',7.5,  168,1,  '7.5 mg/kg PO once', 'Fenbendazole cattle'],
    ['OLD-2-dog-s',   'OLD-2',  'Dog',   25,   12, 5,  '25–50 mg/kg q12h for 5 days PO', 'Albendazole'],
    ['OLD-2-cat-s',   'OLD-2',  'Cat',   15,   12, 5,  '15–20 mg/kg q12h PO', 'Albendazole'],
    ['OLD-114-dog-s', 'OLD-114','Dog',   22,   0,  3,  '22 mg/kg PO once or 3 days', 'Mebendazole'],
    ['OLD-121-dog-s', 'OLD-121','Dog',   0.5,  720,30, '0.5 mg/kg PO q30d (heartworm prev)', 'Milbemycin oxime'],
    ['OLD-121-cat-s', 'OLD-121','Cat',   2,    720,30, '2 mg/kg PO q30d', 'Milbemycin oxime'],
    ['OLD-170-dog-s', 'OLD-170','Dog',   6,    720,30, '6 mg/kg topical q30d', 'Selamectin'],
    ['OLD-170-cat-s', 'OLD-170','Cat',   6,    720,30, '6 mg/kg topical q30d', 'Selamectin'],
    // --- ANTIFUNGALS ---
    ['OLD-105-dog-s', 'OLD-105','Dog',   5,    12, 28, '5–10 mg/kg q12h PO with food', 'Ketoconazole'],
    ['OLD-105-cat-s', 'OLD-105','Cat',   5,    12, 28, '5 mg/kg q12h PO with food', 'Ketoconazole - monitor liver'],
    ['OLD-100-dog-s', 'OLD-100','Dog',   5,    12, 60, '5 mg/kg q12h PO', 'Itraconazole'],
    ['OLD-100-cat-s', 'OLD-100','Cat',   5,    12, 60, '5 mg/kg q12h PO', 'Itraconazole'],
    ['OLD-9-dog-s',   'OLD-9',  'Dog',   0.25, 48, 56, '0.25–0.5 mg/kg q48h IV slow infusion', 'Amphotericin B - nephrotoxic'],
    // --- ANTIHISTAMINES ---
    ['OLD-38-dog-s',  'OLD-38', 'Dog',   0.4,  12, 7,  '0.4–1 mg/kg q12h PO', 'Chlorpheniramine'],
    ['OLD-38-cat-s',  'OLD-38', 'Cat',   0.4,  12, 7,  '0.4–1 mg/kg q12h PO', 'Chlorpheniramine'],
    ['OLD-93-dog-s',  'OLD-93', 'Dog',   1,    8,  7,  '1 mg/kg q8h PO', 'Hydroxyzine'],
    ['OLD-218-dog-s', 'OLD-218','Dog',   0.5,  24, 7,  '0.5–1 mg/kg q24h PO', 'Cetirizine'],
    ['OLD-218-cat-s', 'OLD-218','Cat',   1,    24, 7,  '1 mg/kg q24h PO', 'Cetirizine'],
    // --- ANESTHETICS / SEDATIVES ---
    ['OLD-103-dog-s', 'OLD-103','Dog',   5,    0,  0,  '5–10 mg/kg IV (induction); 10–20 mg/kg IM', 'Ketamine - always combine with sedative'],
    ['OLD-103-cat-s', 'OLD-103','Cat',   11,   0,  0,  '11–33 mg/kg IM for restraint', 'Ketamine cats'],
    ['NEW-10-dog-s',  'NEW-10', 'Dog',   0.05, 0,  0,  '0.05–0.1 mg/kg IM/IV pre-anesthetic', 'Acepromazine'],
    ['NEW-10-cat-s',  'NEW-10', 'Cat',   0.05, 0,  0,  '0.05–0.1 mg/kg IM pre-anesthetic', 'Acepromazine'],
    ['NEW-10-horse-s','NEW-10', 'Horse', 0.05, 0,  0,  '0.05 mg/kg IV slow - monitor BP', 'Acepromazine horse'],
    ['NEW-8-dog-s',   'NEW-8',  'Dog',   1,    0,  0,  '1 mg/kg IM sedation; 0.5 mg/kg IV', 'Xylazine'],
    ['NEW-8-cat-s',   'NEW-8',  'Cat',   1,    0,  0,  '1 mg/kg IM (lower doses than dog)', 'Xylazine'],
    ['NEW-8-cattle-s','NEW-8',  'Cattle',0.05, 0,  0,  '0.05 mg/kg IV / 0.1 mg/kg IM', 'Xylazine cattle - very sensitive'],
    ['OLD-108-dog-s', 'OLD-108','Dog',   2,    0,  0,  '2 mg/kg IV local block; 7 mg/kg max epidural', 'Lidocaine 2%'],
    ['OLD-148-dog-s', 'OLD-148','Dog',   15,   0,  0,  '15 mg/kg slow IV to effect (euthanasia: 85 mg/kg)', 'Pentobarbital'],
    // --- ANTIDOTES ---
    ['OLD-223-dog-s', 'OLD-223','Dog',   0.04, 0,  0,  '0.04 mg/kg IV/IM/SC - repeat q2min as needed', 'Naloxone'],
    ['OLD-223-cat-s', 'OLD-223','Cat',   0.04, 0,  0,  '0.04 mg/kg IV/IM', 'Naloxone'],
    ['OLD-143-dog-s', 'OLD-143','Dog',   10,   12, 90, '10–15 mg/kg q12h PO on empty stomach', 'D-Penicillamine chelation'],
    // --- SULFONAMIDES ---
    ['OLD-175-dog-s', 'OLD-175','Dog',   55,   24, 7,  '55 mg/kg q24h PO on day 1, then 27.5 mg/kg q24h', 'Sulfadimethoxine'],
    ['OLD-175-cat-s', 'OLD-175','Cat',   55,   24, 7,  '55 mg/kg q24h PO day 1, then 27.5 mg/kg', 'Sulfadimethoxine'],
    // --- DIGESTIVE / SUPPORTIVE ---
    ['OLD-62-dog-s',  'OLD-62', 'Dog',   10,   12, 7,  '10 mg/kg q12h IM', 'Dihydrostreptomycin'],
];

db.transaction(() => {
    // Update concentrations
    for (const [drugId, concMg, concMl] of drugConcentrations) {
        updateDrug.run(concMg, concMl, drugId);
    }

    // Upsert structured dosing rules
    for (const rule of structuredRules) {
        upsertRule.run(...rule);
    }
})();

// Verification
const enrichedCount = (db.prepare(
    "SELECT COUNT(*) as c FROM drugs WHERE concentration_mg IS NOT NULL"
).get() as any).c;

const rulesCount = (db.prepare(
    "SELECT COUNT(*) as c FROM drug_dosing_rules WHERE mg_per_kg IS NOT NULL"
).get() as any).c;

console.log(`✓ Drug concentrations enriched: ${enrichedCount}`);
console.log(`✓ Structured dosing rules: ${rulesCount}`);

// Test a calculation
const testDrug = db.prepare('SELECT * FROM drugs WHERE id = ?').get('OLD-8') as any;
const testRule = db.prepare(
    'SELECT * FROM drug_dosing_rules WHERE drug_id = ? AND species = ?'
).get('OLD-8', 'Dog') as any;

if (testDrug && testRule) {
    const weightKg = 20;
    const mgPerDose = testRule.mg_per_kg * weightKg;
    const mlPerDose = (mgPerDose / testDrug.concentration_mg) * testDrug.concentration_ml;
    console.log(`\n--- Calc Test: Amox/Clav for 20kg Dog ---`);
    console.log(`  mg/kg: ${testRule.mg_per_kg}`);
    console.log(`  mg per dose: ${mgPerDose}mg`);
    console.log(`  concentration: ${testDrug.concentration_mg}mg/${testDrug.concentration_ml}ml`);
    console.log(`  mL per dose: ${mlPerDose.toFixed(2)}ml`);
    console.log(`  Frequency: q${testRule.frequency_hours}h for ${testRule.duration_days} days`);
}
