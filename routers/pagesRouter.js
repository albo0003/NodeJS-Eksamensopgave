import { Router } from "express"
import { frontPagePage, creditPagePage, LoginPagePage} from '../utils/pagesUtil.js';



const router = Router()

//check if logged in middleware function
async function isLoggedIn(req, res, next) {
    if(req.session.userId != undefined && req.session.userId != null){
        return next();
    }
    else{
        //you havent logged in
        res.send(LoginPagePage)
    }
    
}

//routers

router.get('/', isLoggedIn, (req, res) => {
    res.send(frontPagePage)
})

router.get('/creditpage', (req, res) => {
    res.send(creditPagePage)
})

export default router;


