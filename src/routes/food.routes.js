import {Router} from "express"
import { isLoggedIn } from "../middlewares/auth.middleware.js"
import {registerFoodJson, searchFood} from "../controllers/food.controller.js"
const router=Router()





router.route("/insertJson").post(registerFoodJson)
router.route("/search/:name").get(isLoggedIn,searchFood)
export default router