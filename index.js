const express = require("express");
const {users}= require("./data/users.json")
const app = express();
const PORT = 8081;
app.use(express.json());


// http://localhost:8081/
app.get("/", (req, res)=>{
    res.status(200).json({
        mesage: "Server is up and running"
    })
})

/*
*route:/user
*method:GET
*description: Get all Users
*access: Public
*parameter: None
*/ 

app.get("/users",(req, res)=>{
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

app.get("/users/:id",(req, res)=>{
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
app.post("/users", (req, res)=>{
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
app.put("/users/:id", (req,res)=>{
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
app.delete("/users/:id",(req,res)=>{
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



app.all("*", (req, res)=>{
    res.status(500).json({
        message: "This route does not exisit :("
    })
})

app.listen(PORT,()=>{
    console.log(`Server is up and running at port:${PORT}`)
})