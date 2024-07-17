import {Router} from "express"
import { isLoggedIn } from "../middlewares/auth.middleware.js"
import {registerFoodJson, searchFood} from "../controllers/food.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
const router=Router()





router.route("/insertJson").post(
    upload.fields(
        [
            {
                name:"foodFile",
                maxCount:1
            }
        ]
    )
    ,registerFoodJson)
router.route("/food").get(isLoggedIn,searchFood)
export default router