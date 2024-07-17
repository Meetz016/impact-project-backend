import {Router} from "express"
import { isLoggedIn } from "../middlewares/auth.middleware.js"
import {searchFood} from "../controllers/food.controller.js"
const router=Router()




router.route("/food").get(isLoggedIn,searchFood)
export default router