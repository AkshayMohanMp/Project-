const express = require("express");

const {users} =require("../data/users.json");


const router = express.Router();








/*
*route:/user
*method:GET
*description: Get all Users
*access: Public
*parameter: None
*/ 

router.get("/",(req, res)=>{
    res.status(200).json({
        success: true,
        data:users
    })
})

/*
*route:/users/:id
*method:GET
*description: Get Single Users by ID
*access: Public
*parameter: ID
*/ 

router.get("/:id",(req, res)=>{
    const {id} =req.params;
    const user = users.find((each)=> each.id ===id);
    if(!user){
        return res.status(404).json({
            success: false,
            message: "USER not Found for the givven ID"
        })
    }
    return res.status(200).json({
        sucess:true,
        data: user
    })
})

/*
*route:/users
*method:POST
*description: Adding a new User
*access: Public
*parameter: no
*/ 
router.post("/", (req, res)=>{
    const{id, name, surname, email, subscriptionType, subscriptionDate } =req.body;
    const user = users.find((each)=> each.id ===id);
    if(user){
        return res.status(404).json({
            success: false,
            message: "User with the sameid exist"
        })
    }
    users.push(
        {id, name, surname, email, subscriptionType, subscriptionDate}
    )
    return res.status(201).json({
        success: true,
        data: users
    })
})

/*
*route:/users/:id
*method:PUT
*description: Updating User
*access: Public
*parameter: ID
*/ 
router.put("/:id", (req,res)=>{
    const {id}= req.params;
    const {data} = req.body;
    const user = users.find((each)=> each.id ===id);
    if(!user){
        return res.status(404).json({
            success: false,
            message: "User with the sameid exist"
        })
    }
    const updateUser = users.map((each)=>{
        if(each.id===id){
            return{
                ...each,
                ...data
            }
        }
        return each;
    })
    return res.status(202).json({
        success: true,
        data: updateUser
    })
})


/*
*route:/users/:id
*method:DELETE
*description: Delete a  User
*access: Public
*parameter: ID
*/ 
router.delete("/:id",(req,res)=>{
    const {id}= req.params;
   
    const user = users.find((each)=> each.id ===id);
    if(!user){
        return res.status(404).json({
            success: false,
            message: "User with the sameid exist"
        })
    }
    const index = users.indexOf(user);
    users.splice(index,1);
    return res.status(200).json({
        success: true,
        data: users
    })
})



/*
*route:/users/Subscription-details/:id
*method:GET
*description: Get all the user Subscription ID
*access: Public
*parameter: ID
*/ 

router.get("/subscription-details/:id",(req, res)=>{
    const {id}= req.params;
    const user = users.find((each)=> each.id ===id);
    if(!user){
        return res.status(404).json({
            success: false,
            message: "User Not found for the given"
        })
    }
    // to know the current days
    
    const getDateInDays = (data ="")=>{
        let date;
        if(data === ""){
            // current date
            date = new Date();
        }else{
             //  getting date on basis of data variable
            date = new Date(data)
        }
        let days= Math.floor(date /(1000 * 60 * 60 * 24))
        return days;
    };
    const subscriptionType = (date) => {
        if(user.subscriptionType === "Basic"){
            date = date +90;}
        else if(user.subscriptionType === "Standard"){
            date = date +180;
        }
        else if(user.subscriptionType === "Premium"){
            date = date +365;
        }
        return date ;
    };

    //  Jan1, 1970 utc // mili secound
    let returnDate = getDateInDays(user.returnDate)
    let currentDate = getDateInDays();
    let subscriptionDate = getDateInDays(user.subscriptionDate);
    let subscriptionExpiration = subscriptionType(subscriptionDate);
    
    const data = {
        ...user,
        subscriptionExpired: subscriptionDate < currentDate,
        daysLeftForExpiration: subscriptionExpiration <= currentDate ?0 : subscriptionExpiration - currentDate,
        fine: returnDate < currentDate ? subscriptionExpiration <= currentDate ? 200 : 100 : 0
    }

    return res.status(200).json({
        success: true,
        data,
    })



})



module.exports = router;