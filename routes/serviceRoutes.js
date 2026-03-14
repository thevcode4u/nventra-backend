import express from 'express';
const router = express.Router();
import Service from '../models/Service.js';
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
        const services = await Service.find().sort({ order: 1 });
        res.json(services);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', auth, upload.single('image'), async (req, res) => {
    const service = new Service({
        title: req.body.title,
        description: req.body.description,
        icon: req.body.icon,
        image: req.file ? `/uploads/${req.file.filename}` : null
    });
    try {
        const newService = await service.save();
        res.status(201).json(newService);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
