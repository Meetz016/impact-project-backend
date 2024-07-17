import {Router} from "express"
import { isLoggedIn, verifyJWT } from "../middlewares/auth.middleware.js"
import {registerFoodJson, searchFood,trackFood} from "../controllers/food.controller.js"
const router=Router()





router.route("/insertJson").post(registerFoodJson)
router.route("/search/:name").get(isLoggedIn,searchFood)
router.route("/tracking").post(verifyJWT,trackFood)
export default router