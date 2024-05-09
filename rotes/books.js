const express = require("express");

const {books} =require("../data/books.json");
const {users} =require("../data/users.json")


const router = express.Router();


/*
*route:/books
*method:GET
*description: Get all books
*access: Public
*parameter: None
*/ 

router.get("/",(req, res)=>{
    res.status(200).json({
        success: true,
        data:books
    })
})



/*
*route:/books/:id
*method:GET
*description: Get Single Users by ID
*access: Public
*parameter: ID
*/ 

router.get("/:id",(req, res)=>{
    const {id} =req.params;
    const book = books.find((each)=> each.id ===id);
    if(!book){
        return res.status(404).json({
            success: false,
            message: "book not Found for the givven ID"
        })
    }
    return res.status(200).json({
        sucess:true,
        data: book
    })
})


/*
*route:/books
*method:POST
*description: Adding a new book
*access: Public
*parameter: no
*/ 
router.post("/", (req, res)=>{
    const{id, name, author, genre, price, publisher} =req.body;

    const book = books.find((each)=> each.id ===id);
    if(book){
        return res.status(404).json({
            success: false,
            message: "Book with the same id exist"
        })
    }
    books.push(
        {id, name, author, genre, price, publisher }
    )
    return res.status(201).json({
        success: true,
        data: books
    })
})



/*
*route:/books/:id
*method:PUT
*description: Updating book by ID
*access: Public
*parameter: ID
*/ 
router.put("/:id", (req,res)=>{
    const {id}= req.params;
    const {data} = req.body;
    const book = books.find((each)=> each.id ===id);
    if(!book){
        return res.status(404).json({
            success: false,
            message: "Books not found exist"
        })
    }
    const updateBook = books.map((each)=>{
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
        data: updateBook
    })
})


/*
*route:/books/:id
*method:DELETE
*description: Delete a  book by id
*access: Public
*parameter: ID
*/ 
router.delete("/:id",(req,res)=>{
    const {id}= req.params;
   
    const book = books.find((each)=> each.id ===id);
    if(!book){
        return res.status(404).json({
            success: false,
            message: "User with the sameid exist"
        })
    }
    const index = books.indexOf(book);
    books.splice(index,1);
    return res.status(200).json({
        success: true,
        data: books
    })
})


/*
*route:/books/issued
*method:GET
*description: Get all Issued books
*access: Public
*parameter: none
*/ 

router.get("/issued/by-user", (req, res)=>{
    const userWithIssuedBooks = users.find((each)=>{
        if(each.issuedBook){
            return each;}   
    })
    const issuedBooks =[];


    userWithIssuedBooks.for((each)=>{
        const book = books.find((book)=> book.id === each.issuedBook);

        book.issuedBy = each.name;
        book.issuedDate = each.issuedDate;
        book.returnDate = each.returnDate;

        issuedBooks.push(book);
    })
    if(issuedBooks.length===0){
        return res.status(404).json({
            success: false,
            message: "No Books Issued"
        })
    }

    return res.status(200).json({
        success: true,
        data: issuedBooks
    })
})


module.exports = router;