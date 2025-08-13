const BookInstance = require('../models/bookinstance');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const Book = require('../models/book');

exports.bookinstance_list = asyncHandler(async (req, res, next)=>{
  const allBookInstances = await BookInstance.find().populate("book").exec();
  res.render("bookinstance_list", {
    title:"Book Instance List",
    bookinstance_list: allBookInstances
  });
})

exports.bookinstance_detail = asyncHandler(async (req, res, next) => {
  const bookInstance = await BookInstance.findById(req.params.id)
  .populate("book")
  .exec();


  if(bookInstance == null) {
    const err = new Error("Book not found");
    err.statur = 404;
    return next(err);
  }

  res.render("bookinstance_detail", {
    title:"Book:",
    bookinstance: bookInstance
  });
})

// 由 GET 处理作者创建操作
exports.bookinstance_create_get = async (req, res, next)=>{
  const allBooks = await Book.find({}, "title").sort({title:1}).exec();

  res.render("bookinstance_form", {
    title: "Create BookInstance",
    book_list: allBooks
  });
};

// 由 POST 处理作者创建操作
exports.bookinstance_create_post = [


  body("book", "Book must be specified")
    .trim()
    .isLength({min:1})
    .escape(),
  
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({min:1})
    .escape(),
  
  body("status").escape(),

  body("due_back", "Invalid date")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  
  async (req, res, next)=>{
    const errors = validationResult(req);
    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back
    });

    if(!errors.isEmpty()) {
      const allBooks = Book.find({},"title").sort({title:1}).exec();

      res.render("bookinstance_form", {
        title: "Create BookInstance",
        book_list: allBooks,
        selected_book: bookInstance.book._id,
        errors: errors.array(),
        bookinstance: bookInstance,
      });

      return;
    }

    await bookInstance.save();
    res.redirect(bookInstance.url);
  }
]


// 由 GET 显示删除作者的表单
exports.bookinstance_delete_get = async (req, res, next)=>{
  const bookInstance = await BookInstance.findById(req.params.id)
          .populate("book")
          .exec();
  
  if(bookInstance === null) {
    res.redirect("/catalog/bookinstances");
  }

  res.render("bookinstance_delete", {
    title: "Delete BookInstance",
    bookinstance: bookInstance,
  })
};
// 由 POST 处理作者删除操作
exports.bookinstance_delete_post = async (req, res, next)=>{
  await BookInstance.findByIdAndDelete(req.params.id);
  res.redirect("/catalog/bookinstances");
};

// 由 GET 处理作者创建操作
exports.bookinstance_update_get = async (req, res, next)=>{
  const [bookInstance, allBooks] = await Promise.all([
    BookInstance.findById(req.params.id).populate("book").exec(),
    Book.find()
  ]);

  if(bookInstance === null) {
    const err = new Error("Book copy not found");
    err.status = 404;
    return next(err);
  }
  
  res.render("bookinstance_form", {
    title: "Update BookInstance",
    book_list: allBooks,
    selected_book: bookInstance.book._id,
    bookinstance: bookInstance,
  });
};

// 由 POST 处理作者创建操作
exports.bookinstance_update_post = [


  body("book", "Book must be specified")
    .trim()
    .isLength({min:1})
    .escape(),
  
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({min:1})
    .escape(),
  
  body("status").escape(),

  body("due_back", "Invalid date")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  
  async (req, res, next)=>{
    const errors = validationResult(req);
    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back
    });

    if(!errors.isEmpty()) {
      const allBooks = Book.find({},"title").sort({title:1}).exec();

      res.render("bookinstance_form", {
        title: "Create BookInstance",
        book_list: allBooks,
        selected_book: bookInstance.book._id,
        errors: errors.array(),
        bookinstance: bookInstance,
      });

      return;
    }

    await bookInstance.save();
    res.redirect(bookInstance.url);
  }
]
