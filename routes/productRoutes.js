import express from 'express'
import { isAdmin, requireSignin } from '../middlewares/authMiddleware.js'
import { braintreePaymentController, braintreeTokenController, createProductController, deleteProductController, getProductController, getSingleProductController, productCategoryController, productCountController, productFIltersController, productListController, productPhotoController, relatedProductController, searchProductController, updateProductController } from '../controllers/productController.js'
import formidable from 'express-formidable'
const router = express.Router()

//routes
router.post('/create-product', requireSignin, isAdmin,formidable(), createProductController)

//get produts
router.get('/get-product', getProductController)

//single product
router.get('/get-product/:slug', getSingleProductController)

//get phoot
router.get('/product-photo/:pid', productPhotoController)

//delete product
router.delete("/delete-product/:pid", deleteProductController);

//update product
router.put(
    "/update-product/:pid",
    requireSignin,
    isAdmin,
    formidable(),
    updateProductController
  );

  //filter product
  router.post('/product-filters', productFIltersController)

  //product count 
  router.get('/product-count', productCountController)

  //product per page
  router.get('/product-list/:page', productListController)

  //search product 
  router.get('/search/:keyword', searchProductController)

  //similar products
  router.get('/related-product/:pid/:cid', relatedProductController)

  //catefory wisw product
  router.get('/product-category/:slug', productCategoryController)

  //payment route
  //token
  router.get('/braintree/token', braintreeTokenController)

  //payments
  router.post ('/braintree/payment', requireSignin, braintreePaymentController)

export default router