import e, { Router } from "express"

import db from "../database/connectionMongoDB.js";
import { ObjectId } from "mongodb";

import {hashPassword, comparePasswords} from "../utils/passwordHashing.js"
import session from "express-session";

const router = Router()

//routers
router.post("/auth/login", async (req, res) =>  {

    const user = await db.users.findOne({username: req.body.username})
    if(user === null){
       res.status(404).send({data: "not right Username"})
    }
    else{
        const isRightPassword = await comparePasswords(req.body.password, user.password)
        if(isRightPassword){
          req.session.userId = user._id
          res.send({user: user.username})
        }
        else{
            res.status(404).send({data: "not right Password"})
        }
    }

    
    
})

router.post("/auth/signup", async (req,res) => {

    const { username, password, email, isallowed} = req.body;

    const user = await db.users.findOne({username: username})
    if(user){
        res.status(404).send({data: "user with that username already exists"})
        return
    } 

    const hashedPassword = await hashPassword(password)
    
    const result = await db.users.insertOne({ username: username, password: hashedPassword});
    

    if(result){
        req.session.userId = result.insertedId
    }
        

    res.send({ data: { id: result.insertedId } });
})

router.get("/auth/signout", async (req,res) => {

    req.session.userId = null

    res.send({data: "you are signed out"})
})


router.get("/me", async (req, res) => { 
    if (!req.session.userId) {
        return res.json({ loggedIn: false });
    }

    const user = await db.users.findOne({_id: new ObjectId(req.session.userId)})
    
 
    res.json({
        loggedIn: true,
        userId: req.session.userId,
        username: user.username
    });
});

export default router;