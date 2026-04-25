import { calculatePrescription } from './services/drugRules';

const tests = [
    { label: 'Amoxicillin/Clav - 20kg Dog',   drugId: 'OLD-8',   species: 'Dog',    weightKg: 20 },
    { label: 'Enrofloxacin - 5kg Cat',         drugId: 'OLD-69',  species: 'Cat',    weightKg: 5  },
    { label: 'Dexamethasone - 450kg Cattle',   drugId: 'OLD-55',  species: 'Cattle', weightKg: 450},
    { label: 'Ivermectin - 350kg Cattle',      drugId: 'NEW-1',   species: 'Cattle', weightKg: 350},
    { label: 'Furosemide - 8kg Dog',           drugId: 'OLD-84',  species: 'Dog',    weightKg: 8  },
    { label: 'Ketamine - 3.5kg Cat (no weight)',drugId:'OLD-103', species: 'Cat',    weightKg: undefined},
];

for (const t of tests) {
    console.log(`\n=== ${t.label} ===`);
    const r = calculatePrescription(t as any);
    console.log(`  Status:        ${r.calculationStatus}`);
    console.log(`  mg/kg:         ${r.mgPerKg ?? 'N/A'}`);
    console.log(`  mg per dose:   ${r.calculatedMgPerDose?.toFixed(2) ?? 'N/A'}`);
    console.log(`  mL per dose:   ${r.calculatedMlPerDose?.toFixed(3) ?? 'N/A'}`);
    console.log(`  Concentration: ${r.concentrationText ?? 'Not set'}`);
    if (r.warnings.length) console.log(`  Warnings:      ${r.warnings.join('; ')}`);
    if (r.calculationNotes) console.log(`  Notes:         ${r.calculationNotes}`);
}
