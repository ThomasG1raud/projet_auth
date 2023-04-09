const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const mongoose = require('mongoose');
const router = express.Router();

// Connecter à la base de données
mongoose.connect('mongodb://localhost:27017/images', { useNewUrlParser: true });

// Définir un schéma et un modèle pour les images
const imageSchema = new mongoose.Schema({
    data: Buffer,
    contentType: String
});
const Image = mongoose.model('Image', imageSchema);

// Définir un schéma et un modèle pour les galeries d'images
const gallerySchema = new mongoose.Schema({
    name: String,
    description: String,
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }]
});
const Gallery = mongoose.model('Gallery', gallerySchema);

// Configurer multer pour gérer le téléchargement d'images
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Vérifier l'extension de l'image
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Veuillez télécharger une image au format JPG, JPEG ou PNG.'));
        }
        cb(null, true);
    },
    limits: {
        // Limiter la taille de l'image à 10 Mo
        fileSize: 1024 * 1024 * 10
    }
});

// Route pour télécharger une image
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        // Compresser l'image
        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
        // Stocker l'image dans la bd
        const image = new Image({ data: buffer, contentType: 'image/png' });
        await image.save();
        res.send(image);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Route pour récupérer toutes les images
router.get('/images', async (req, res) => {
    try {
        // Récupérer les images de la base de données MongoDB
        const images = await Image.find({});
        res.send(images);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

//Route pour supprimer toutes les images
router.delete('/images', async (req, res) => {
    try {
        // Récupérer les images de la base de données MongoDB
        const images = await Image.deleteMany({});
        res.send(images);
    } catch (error) {
        res.status(400).send(error.message);
    }
});


// Route pour créer une galerie d'images
router.post('/galleries', async (req, res) => {
    try {
        // Récupérer les données de la galerie à partir de la requête
        const { name, description, images } = req.body;
        // Créer une nouvelle galerie
        const gallery = new Gallery({ name, description, images });
        // Enregistrer la galerie dans la base de données
        await gallery.save();
        res.send(gallery);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Route pour récupérer toutes les galeries d'images
router.get('/galleries', async (req, res) => {
    try {
        // Récupérer les galeries de la base de données MongoDB
        const galleries = await Gallery.find({}).populate('images');
        res.send(galleries);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

//Route recuperer une seule galerie
router.get('/galleries/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let safeId = id;
        if (Array.isArray(id)) {
            safeId = id.pop();
        }
        const gallery = await Gallery.findById(safeId).populate('images');
        res.send(gallery);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

//ajouter une image a une galerie
router.patch('/galleries/:id/images', async (req, res) => {
    try {
        const { id } = req.params;
        const { imageId } = req.body;
        const gallery = await Gallery.findById(id);
        gallery.images.push(imageId);
        await gallery.save();
        res.send(gallery);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// supprimer toutes les galleries
router.delete('/galleries', async (req, res) => {
    try {
        await Gallery.deleteMany({});
        res.send({ message: 'All galleries deleted' });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

//supprimer une gallerie
router.delete('/galleries/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Gallery.deleteOne({ _id: id });
        res.send({ message: 'Gallery deleted' });
    } catch (error) {
        res.status(400).send(error.message);
    }
});


module.exports = router;
