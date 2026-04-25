import { Router, Request, Response } from 'express';
import db from '../db';

const router = Router();

// GET /api/drugs
// Query parameters: q (search term), category, species
router.get('/', (req: Request, res: Response) => {
    try {
        const { q, category, species } = req.query;
        let queryStr = 'SELECT id, generic_name, brand_names, category, species, formulation, concentration_mg, concentration_ml, route FROM drugs WHERE 1=1';
        const params: any[] = [];

        if (q) {
            queryStr += ' AND (generic_name LIKE ? OR brand_names LIKE ? OR indications LIKE ?)';
            const searchParam = `%${q}%`;
            params.push(searchParam, searchParam, searchParam);
        }

        if (category) {
            queryStr += ' AND category = ?';
            params.push(category);
        }

        if (species) {
            queryStr += ' AND species LIKE ?';
            params.push(`%${species}%`);
        }

        queryStr += ' ORDER BY generic_name ASC LIMIT 100';

        const stmt = db.prepare(queryStr);
        const drugs = stmt.all(...params);

        res.json({ success: true, count: drugs.length, data: drugs });
    } catch (error) {
        console.error('Error fetching drugs:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// GET /api/drugs/:id
router.get('/:id', (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const drugStmt = db.prepare('SELECT * FROM drugs WHERE id = ?');
        const drug = drugStmt.get(id);

        if (!drug) {
            return res.status(404).json({ success: false, error: 'Drug not found' });
        }

        const rulesStmt = db.prepare('SELECT * FROM drug_dosing_rules WHERE drug_id = ?');
        const rules = rulesStmt.all(id);

        res.json({
            success: true,
            data: {
                ...drug,
                dosing_rules: rules
            }
        });
    } catch (error) {
        console.error('Error fetching drug details:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

export default router;
