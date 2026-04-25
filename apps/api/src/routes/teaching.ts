import { Router, Request, Response } from 'express';
import db from '../db';

const router = Router();

// GET /api/teaching/cases
router.get('/cases', (req: Request, res: Response) => {
    try {
        const { department, species, review_status } = req.query;
        let queryStr = 'SELECT * FROM teaching_cases WHERE 1=1';
        const params: any[] = [];

        if (department) {
            queryStr += ' AND department = ?';
            params.push(department);
        }

        if (species) {
            queryStr += ' AND species_tags LIKE ?';
            params.push(`%${species}%`);
        }

        if (review_status) {
            queryStr += ' AND review_status = ?';
            params.push(review_status);
        }

        queryStr += ' ORDER BY created_at DESC LIMIT 50';

        const stmt = db.prepare(queryStr);
        const cases = stmt.all(...params);

        res.json({ success: true, count: cases.length, data: cases });
    } catch (error) {
        console.error('Error fetching teaching cases:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// POST /api/teaching/cases
router.post('/cases', (req: Request, res: Response) => {
    try {
        const payload = req.body;
        
        const stmt = db.prepare(`
            INSERT INTO teaching_cases (
                id, title, department, species_tags, signalment, history, 
                findings, discussion_phase, learning_objectives, 
                review_status, review_type, created_by
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        `);
        
        const id = 'tc_' + Date.now();
        stmt.run(
            id,
            payload.title || 'Untitled Case',
            payload.department || null,
            payload.species_tags || null,
            payload.signalment || null,
            payload.history || null,
            payload.findings || null,
            payload.discussion_phase || 'Signalment',
            payload.learning_objectives || null,
            payload.review_status || 'Draft',
            payload.review_type || 'Peer',
            payload.created_by || 'Unknown'
        );

        res.json({ success: true, id });
    } catch (error: any) {
        console.error('Error saving teaching case:', error);
        res.status(500).json({ success: false, error: error.message || 'Internal server error' });
    }
});

export default router;
