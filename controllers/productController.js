/*const Product = require('../models/Product');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const productController = {
  // Create a new product
  createProduct: async (req, res) => {
    try {
      // Parse the JSON fields from FormData
      const { name, description, mainCategory, subCategory, brand, price, stock, attributes } = req.body;
      
      // Parse attributes if it's a string
      const parsedAttributes = typeof attributes === 'string' ? JSON.parse(attributes) : attributes;

      // Upload images to Cloudinary
      const imageUrls = [];
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          // Upload from buffer since we're using memory storage
          const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: 'products' },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            
            uploadStream.end(file.buffer);
          });
          
          imageUrls.push(result.secure_url);
        }
      }

      // Create new product
      const newProduct = new Product({
        name,
        description,
        category: {
          main: mainCategory,
          sub: subCategory,
          brand
        },
        price: parseFloat(price),
        stock: parseInt(stock),
        images: imageUrls,
        attributes: parsedAttributes
      });

      await newProduct.save();

      res.status(201).json({
        success: true,
        product: newProduct
      });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating product',
        error: error.message
      });
    }
  },

  // Get all products
 // Get all products (no filters)
getProducts: async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
},
};

module.exports = productController;*/


const Product = require('../models/Product');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const productController = {
  // Create a new product
  createProduct: async (req, res) => {
    try {
      // Parse the JSON fields from FormData
      const { name, description, mainCategory, subCategory, brand, price, stock, releaseDate, attributes } = req.body;
      
      // Parse attributes if it's a string
      const parsedAttributes = typeof attributes === 'string' ? JSON.parse(attributes) : attributes;

      // Upload images to Cloudinary
      const imageUrls = [];
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: 'products' },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            uploadStream.end(file.buffer);
          });
          imageUrls.push(result.secure_url);
        }
      }

      // Create new product
      const newProduct = new Product({
        name,
        description,
        category: {
          main: mainCategory,
          sub: subCategory,
          brand
        },
        price: parseFloat(price),
        stock: parseInt(stock),
        releaseDate,
        images: imageUrls,
        attributes: parsedAttributes
      });

      await newProduct.save();

      res.status(201).json({
        success: true,
        product: newProduct
      });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating product',
        error: error.message
      });
    }
  },

  // Get all products
  getProducts: async (req, res) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      res.status(200).json({
        success: true,
        count: products.length,
        products
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },

  // Get a single product by ID
  getProductById: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      res.status(200).json({
        success: true,
        product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },

  // Update a product by ID
  updateProduct: async (req, res) => {
    try {
      const { name, description, mainCategory, subCategory, brand, price, stock, releaseDate, attributes } = req.body;
      const parsedAttributes = typeof attributes === 'string' ? JSON.parse(attributes) : attributes;

      // Find the product
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Upload new images to Cloudinary
      const newImageUrls = [];
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: 'products' },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            uploadStream.end(file.buffer);
          });
          newImageUrls.push(result.secure_url);
        }
      }

      // Update product fields
      product.name = name || product.name;
      product.description = description || product.description;
      product.category.main = mainCategory || product.category.main;
      product.category.sub = subCategory || product.category.sub;
      product.category.brand = brand || product.category.brand;
      product.price = price ? parseFloat(price) : product.price;
      product.stock = stock ? parseInt(stock) : product.stock;
      product.releaseDate = releaseDate || product.releaseDate;
      product.attributes = parsedAttributes || product.attributes;
      product.images = [...product.images, ...newImageUrls];

      await product.save();

      res.status(200).json({
        success: true,
        product
      });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating product',
        error: error.message
      });
    }
  },

  // Delete a product by ID
  deleteProduct: async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Delete images from Cloudinary
      for (const imageUrl of product.images) {
        const publicId = imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`products/${publicId}`);
      }

      res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },

  // Delete a specific image from a product
  deleteProductImage: async (req, res) => {
    try {
      const { productId, imageUrl } = req.params;

      // Find the product
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Remove the image from the array
      product.images = product.images.filter(img => img !== imageUrl);

      // Delete the image from Cloudinary
      const publicId = imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`products/${publicId}`);

      await product.save();

      res.status(200).json({
        success: true,
        message: 'Image deleted successfully',
        product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  }
};

module.exports = productController;