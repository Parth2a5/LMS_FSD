// Import required packages
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));


// Book Schema
const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    publishedYear: Number,
    genre: String,
    available: {
        type: Boolean,
        default: true
    }
});

// Model
const Book = mongoose.model("Book", bookSchema);



/* ------------------ ROUTES ------------------ */


// 1️⃣ Add new book
app.post("/books", async (req, res) => {
    try {
        const book = new Book(req.body);
        const savedBook = await book.save();
        res.status(201).json(savedBook);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// 2️⃣ View all books
app.get("/books", async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// 3️⃣ Update book details
app.put("/books/:id", async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedBook);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// 4️⃣ Delete book
app.delete("/books/:id", async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// 5️⃣ Search book by title or author
app.get("/books/search", async (req, res) => {
    try {

        const keyword = req.query.q;

        const books = await Book.find({
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { author: { $regex: keyword, $options: "i" } }
            ]
        });

        res.json(books);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// Server Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



console.log("Hello, World!");

let name = "John";
console.log("My name is", name);

// Or try some calculations
let sum = 5 + 3;
console.log("5 + 3 =", sum);
