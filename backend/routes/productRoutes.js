// routes/productRoutes.js
const express = require('express');
const multer = require('multer');
const { addProduct, getProducts, getCardProducts,getUpdateProducts } = require('../controllers/productController');
const {
    selectProduct,
    deleteProduct,
    productUpdate,
    updateProduct
} = require('../controllers/productController');

const router = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.post('/newproduct', upload.single('image'), addProduct);
router.get('/ourproduct', getProducts);
router.get('/card', getCardProducts);
router.get('/updateproduct', getUpdateProducts);
router.post('/selectproduct', selectProduct); // Route to select a product
router.post('/deleteproduct', deleteProduct); // Route to delete a product
router.post('/productupdate', productUpdate); // Route to fetch product details for update
router.post('/upproduct', upload.single('image'), updateProduct);
module.exports = router;
