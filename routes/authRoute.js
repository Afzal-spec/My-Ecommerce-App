import express from 'express'
import { 
    registerController, 
    loginController,
    testController,
    forgotPasswordController,
    updateProfileController,
    getOrdersController,
    getAllOrdersController,
    orderStatusController,
} from '../controllers/authController.js';
import { isAdmin, requireSignin } from '../middlewares/authMiddleware.js';
//router object
const router = express.Router()

//routing 
//REGISTER || METHOD POST
router.post('/register',registerController)

//LOGIN ||POST
router.post('/login',loginController);

//  FORGOT PASSWORD || POST
router.post('/forgot-password', forgotPasswordController)

//test routes 
router.get('/test', requireSignin , isAdmin , testController)

//protected User route auth
router.get('/user-auth', requireSignin, (req, res) => {
    res.status(200).send({ ok: true })
})

//protected Admin route auth
router.get('/admin-auth', requireSignin, isAdmin, (req, res) => {
    res.status(200).send({ ok: true })
})


//update profile
router.put('/profile',requireSignin, updateProfileController)

//orders
router.get('/orders', requireSignin, getOrdersController)

// All orders
//orders
router.get('/all-orders', requireSignin, isAdmin, getAllOrdersController)

//status update
router.put("/order-status/:orderId", requireSignin, isAdmin, orderStatusController)

export default router;