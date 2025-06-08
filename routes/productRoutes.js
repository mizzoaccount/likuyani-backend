/*const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/uploadMiddleware');
const { authorize } = require('../middleware/auth');



//router.use(authorize('admin'));
// Create a new product
router.post('/', upload.array('images', 5), productController.createProduct);
// Simple GET endpoint for all products
router.get('/', productController.getProducts);

module.exports = router;*/

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/uploadMiddleware');
const { authorize } = require('../middleware/auth');

// Apply admin authorization middleware to all product routes
// router.use(authorize('admin'));

// Create a new product
router.post('/', upload.array('images', 5), productController.createProduct);

// Get all products
router.get('/', productController.getProducts);

// Get a single product by ID
router.get('/:id', productController.getProductById);

// Update a product by ID
router.put('/:id', upload.array('images', 5), productController.updateProduct);

// Delete a product by ID
router.delete('/:id', productController.deleteProduct);

// Delete an image from a product
router.delete('/:productId/images/:imageUrl', productController.deleteProductImage);

module.exports = router;