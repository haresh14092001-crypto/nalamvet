import { Router, Request, Response } from 'express';
import db from '../db';
import { calculatePrescription, CalculationRequest } from '../services/drugRules';

const router = Router();

// POST /api/prescriptions/calculate
router.post('/calculate', (req: Request, res: Response) => {
    try {
        const payload: CalculationRequest = req.body;
        
        if (!payload.drugId) {
            return res.status(400).json({ success: false, error: 'drugId is required' });
        }

        const calculation = calculatePrescription(payload);
        
        res.json({
            success: true,
            data: calculation
        });

    } catch (error: any) {
        console.error('Error calculating prescription:', error);
        res.status(500).json({ success: false, error: error.message || 'Internal server error' });
    }
});

// POST /api/prescriptions
router.post('/', (req: Request, res: Response) => {
    try {
        const payload = req.body;
        // In a real app we would validate payload structure here
        
        const stmt = db.prepare(`
            INSERT INTO prescriptions (
                id, case_id, pet_id, species, weight_kg, drug_id, 
                selected_formulation, route, frequency, duration, dose_rule_used, 
                mg_per_kg, calculated_mg_per_dose, concentration, 
                calculated_ml_per_dose, warnings, calculation_status, calculation_notes
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        `);
        
        const id = 'rx_' + Date.now();
        stmt.run(
            id,
            payload.caseId || null,
            payload.petId || null,
            payload.species || null,
            payload.weightKg || null,
            payload.drugId || null,
            payload.selectedFormulation || null,
            payload.route || null,
            payload.frequency || null,
            payload.duration || null,
            payload.doseRuleUsed || null,
            payload.mgPerKg || null,
            payload.calculatedMgPerDose || null,
            payload.concentrationText || null,
            payload.calculatedMlPerDose || null,
            payload.warnings ? JSON.stringify(payload.warnings) : null,
            payload.calculationStatus || null,
            payload.calculationNotes || null
        );

        res.json({ success: true, id });
    } catch (error: any) {
        console.error('Error saving prescription:', error);
        res.status(500).json({ success: false, error: error.message || 'Internal server error' });
    }
});

export default router;
