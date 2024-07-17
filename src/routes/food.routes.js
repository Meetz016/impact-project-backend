import {Router} from "express"
import { isLoggedIn, verifyJWT } from "../middlewares/auth.middleware.js"
import {registerFoodJson, searchFood,trackFood,trackMyFood,deleteTrackedFood} from "../controllers/food.controller.js"
const router=Router()





router.route("/insertJson").post(registerFoodJson)
router.route("/search/:name").get(isLoggedIn,searchFood)
router.route("/tracking").post(verifyJWT,trackFood)
router.route("/tracking/me").get(verifyJWT,trackMyFood)
router.route("/tracking/me/deleteItem").post(verifyJWT,deleteTrackedFood)
export default router