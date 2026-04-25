import db from '../db';

export interface CalculationRequest {
    petId?: string;
    caseId?: string;
    species?: string;
    weightKg?: number;
    drugId: string;
    selectedFormulation?: string;
}

export interface CalculationResponse {
    drugId: string;
    genericName: string;
    species: string;
    weightKg: number | null;
    mgPerKg: number | null;
    calculatedMgPerDose: number | null;
    concentrationText: string | null;
    calculatedMlPerDose: number | null;
    doseRuleUsed: string | null;
    warnings: string[];
    contraindications: string;
    calculationStatus: 'SUCCESS' | 'PARTIAL' | 'MANUAL_REVIEW_REQUIRED' | 'FAILED';
    calculationNotes: string;
}

export function calculatePrescription(req: CalculationRequest): CalculationResponse {
    const warnings: string[] = [];
    let status: CalculationResponse['calculationStatus'] = 'SUCCESS';
    let notes = '';

    // Fetch drug
    const drugStmt = db.prepare('SELECT * FROM drugs WHERE id = ?');
    const drug: any = drugStmt.get(req.drugId);

    if (!drug) {
        throw new Error('Drug not found');
    }

    const res: CalculationResponse = {
        drugId: drug.id,
        genericName: drug.generic_name,
        species: req.species || 'Unknown',
        weightKg: req.weightKg || null,
        mgPerKg: null,
        calculatedMgPerDose: null,
        concentrationText: null,
        calculatedMlPerDose: null,
        doseRuleUsed: null,
        warnings: [],
        contraindications: drug.contraindications || '',
        calculationStatus: 'SUCCESS',
        calculationNotes: ''
    };

    if (!req.species) {
        warnings.push('Species not provided. Cannot verify safety or dose rule.');
        status = 'MANUAL_REVIEW_REQUIRED';
    } else if (drug.species && !drug.species.toLowerCase().includes(req.species.toLowerCase()) && drug.species !== 'All') {
        warnings.push(`Warning: Drug may not be indicated for ${req.species}. Listed species: ${drug.species}`);
    }

    if (!req.weightKg || req.weightKg <= 0) {
        warnings.push('Pet weight missing. Cannot compute mg per dose.');
        status = 'MANUAL_REVIEW_REQUIRED';
    }

    // Try to find a dosing rule
    let rule: any = null;
    if (req.species) {
        // Prefer structured rule (mg_per_kg set) over legacy text-only
        const ruleStmt = db.prepare(`
            SELECT * FROM drug_dosing_rules
            WHERE drug_id = ? AND species LIKE ?
            ORDER BY (mg_per_kg IS NOT NULL) DESC, id DESC
            LIMIT 1
        `);
        rule = ruleStmt.get(drug.id, `%${req.species}%`);
    }

    if (!rule) {
        warnings.push('No structured dosing rule found for this species. Check notes for manual dosage text.');
        status = 'MANUAL_REVIEW_REQUIRED';
        // Check if there are generic rules we can extract text from
        const allRulesStmt = db.prepare('SELECT * FROM drug_dosing_rules WHERE drug_id = ?');
        const allRules: any[] = allRulesStmt.all(drug.id);
        if (allRules.length > 0) {
            notes += 'Available dose texts: ' + allRules.map(r => `[${r.species}]: ${r.dose_text}`).join('; ');
        }
    } else {
        res.doseRuleUsed = rule.id;
        notes += `Dose text: ${rule.dose_text}. `;
        
        // Attempt to parse mg/kg if it's not structured yet
        if (rule.mg_per_kg) {
            res.mgPerKg = rule.mg_per_kg;
        } else {
            // Very basic heuristic to extract mg/kg from text (e.g., "5 mg/kg")
            const match = rule.dose_text ? rule.dose_text.match(/(\d+(\.\d+)?)\s*mg\/kg/i) : null;
            if (match) {
                res.mgPerKg = parseFloat(match[1]);
            } else {
                warnings.push('Dose rule is text-only. Cannot automatically calculate mg per dose.');
                status = 'PARTIAL';
            }
        }
    }

    // Calculate mg
    if (res.mgPerKg && req.weightKg) {
        res.calculatedMgPerDose = res.mgPerKg * req.weightKg;
    }

    // Calculate mL if concentration exists
    if (drug.concentration_mg && drug.concentration_ml && res.calculatedMgPerDose) {
        res.concentrationText = `${drug.concentration_mg}mg / ${drug.concentration_ml}ml`;
        res.calculatedMlPerDose = (res.calculatedMgPerDose / drug.concentration_mg) * drug.concentration_ml;
    } else if (res.calculatedMgPerDose) {
        warnings.push('Drug concentration missing from database. Cannot calculate mL volume.');
        status = 'PARTIAL';
    }

    res.warnings = warnings;
    res.calculationStatus = status;
    res.calculationNotes = notes.trim();

    return res;
}
