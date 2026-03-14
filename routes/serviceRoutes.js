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
        const query = req.query.category ? { category: req.query.category } : {};
        const services = await Service.find(query).sort({ order: 1 });
        res.json(services);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        res.json(service);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', auth, upload.single('image'), async (req, res) => {
    const service = new Service({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
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

router.put('/:id', auth, upload.single('image'), async (req, res) => {
    try {
        const updateData = {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            icon: req.body.icon
        };
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }
        const updatedService = await Service.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updatedService);
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
