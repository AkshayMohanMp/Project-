const express = require("express");
const dotenv =require('dotenv');

// json dat Input
const {users}= require("./data/users.json")
//  Importing routes
const usersRouter = require("./rotes/users");
const booksRouter = require("./rotes/books");

// DataBase Connection
const DbConnection = require("./databaseConnection");

dotenv.config();

const app = express();

DbConnection();

const PORT = 8081;
app.use(express.json());


// http://localhost:8081/
app.get("/", (req, res)=>{
    res.status(200).json({
        mesage: "Server is up and running"
    })
})


app.use("/users", usersRouter);
app.use("/books", booksRouter);




app.all("*", (req, res)=>{
    res.status(500).json({
        message: "This route does not exisit :("
    })
})

app.listen(PORT,()=>{
    console.log(`Server is up and running at port:${PORT}`)
})