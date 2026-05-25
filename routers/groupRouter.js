import e, { Router } from "express"

import db from "../database/connectionMongoDB.js";
import { ObjectId } from "mongodb";

const router = Router()


router.get("/groups", async (req, res) => {
    const groups = await db.groups.find({users: req.session.userId},
        {
            projection: {
                _id: 1,
                name: 1,
                image: 1
            }
        }).toArray()
    if(groups.length > 0){
        res.send({data: groups})
    }
    else{
        res.status(404).send({data: "no groups for user"})
    }
    
})

router.get("/group/:id", async (req, res) => {
    const group = await db.groups.findOne({_id: new ObjectId(req.params.id), users: req.session.userId})

        if (!group) {
            return res.status(404).send({
                data: "Either you're not allowed to see this, or its wrong group id"
            })
        }

    if(group.messages){
        const userIds = group.messages.map((message) => message.user);

        const users = await db.users.find({_id: { $in: userIds.map((id) => new ObjectId(id)) }}).toArray()

        const userMap = {};

        for (let i = 0; i < users.length; i++) {
            userMap[users[i]._id.toString()] = users[i].username;
        }

        group.messages = group.messages.map((msg) => ({
            message: msg.message,
            username: userMap[msg.user],
            date: msg.date
        }))
    }
    

    res.send({ data: group })
})

router.post("/newgroup", async (req,res) => {
    const result = await db.groups.insertOne({name: req.body.name, image: req.body.image, users: [req.session.userId]})
    if(result){
        res.send({data: result})
    }
    else{
        res.status(404).send({data: "something went wrong"})
    }

})

//add user to group
router.put("/user", async (req, res) => {
    const user = await db.users.findOne({username: req.body.name})
    if(user){
        const groupUsers = await db.groups.findOne({_id: new ObjectId(req.body._id), users: user._id.toString()})
        if(groupUsers){
            res.status(404).send({data: "user is already in group"})
        }
        else{
            const result = await db.groups.updateOne({_id: new ObjectId(req.body._id)}, { $push: {users: user._id.toString()}})
            if(result){
                res.send({data: "inserted"})
            }
            else{
                res.status(404).send({data: "something went wrong with inserting user"})
            }
        }
    }
    else{
        res.status(404).send({data: "No user with that username"})
    }
})

//remove user from group
router.put("/removeUser", async (req, res) => {
    const result = await db.groups.updateOne({_id: new ObjectId(req.body._id)}, {$pull: {users: req.session.userId}})
    if(result){
        const group = await db.groups.findOne({_id: new ObjectId(req.body._id)})
        if(group.users.length === 0){
            db.groups.deleteOne({_id: new ObjectId(req.body._id)})
        }
        res.send({data: "user removed"})
    }
    else{
        res.status(404).send({data: "something wrong, idk"})
    }
})


export default router; 