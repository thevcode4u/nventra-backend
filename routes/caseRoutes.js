import express from 'express';
const router = express.Router();
import Case from '../models/Case.js';
import multer from 'multer';
import path from 'path';
import auth from '../middleware/authMiddleware.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
    try {
        const cases = await Case.find();
        res.json(cases);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', auth, upload.single('image'), async (req, res) => {
    const newCase = new Case({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        image: req.file ? `/uploads/${req.file.filename}` : null
    });
    try {
        const savedCase = await newCase.save();
        res.status(201).json(savedCase);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        await Case.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
