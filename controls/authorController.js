const Author = require("../models/author");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const {body, validationResult} = require("express-validator");

// 显示完整的作者列表
exports.author_list = asyncHandler(async (req, res, next)=>{
  const allAuthors = await Author.find().sort({family_name:1}).exec();
  res.render("author_list", {
    title: "Author list",
    author_list:allAuthors
  });
});

// 为每位作者显示详细信息的页面
exports.author_detail = asyncHandler(async (req, res, next)=>{
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({author:req.params.id}, "title summary").exec()
  ]);

  if(author == null) {
    const err = new Error("Author not found");
    err.status = 404;
    return next(err);
  }

  res.render("author_detail", {
    title: "Author Detail",
    author: author,
    author_books: allBooksByAuthor
  });

});

// 由 GET 处理作者创建操作
exports.author_create_get = async (req, res, next)=>{
  res.render("author_form", {title:"Create Author"});
};

// 由 POST 处理作者创建操作
exports.author_create_post = [
  body("first_name")
    .trim()
    .isLength({min:1})
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("irst name has non-alphanumeric characters."),
  
  body("family_name")
    .trim()
    .isLength({min:1})
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  
  body("date_of_birth", "Invalid date of birth")
    .optional({values: "falsy"})
    .isISO8601()
    .toDate(),

  body("date_of_death", "Invalid date of death")
    .optional({values: "falsy"})
    .isISO8601()
    .toDate(),
  
  asyncHandler(async (req, res, next)=>{
    const errors = validationResult(req);

    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death
    });

    if(!errors.isEmpty()) {
      res.render("author_form", {
        title: "Create Author",
        author: author,
        errors: errors.array(),
      });
      return;
    }

    await author.save();
    res.redirect(author.url);
  }),

];

// 由 GET 显示删除作者的表单
exports.author_delete_get = async (req, res, next)=>{
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({author:req.params.id},"title summary").exec()
  ]);

  if(author == null) {
    res.redirect("/catalog/authors");
    return;
  }

  res.render("author_delete", {
    title: "Delete Author",
    author,
    author_books: allBooksByAuthor
  });
};

// 由 POST 处理作者删除操作
exports.author_delete_post = async (req, res, next)=>{
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({author:req.params.id},"title summary").exec()
  ]);

  if(allBooksByAuthor.length > 0) {
    res.render("author_delete", {
      title: "Delete Author",
      author,
      author_books: allBooksByAuthor
    });
    return;
  }

  await Author.findByIdAndDelete(req.body.authorid);
  res.redirect("/catalog/authors");
};


// 由 GET 处理作者创建操作
exports.author_update_get = async (req, res, next)=>{
  const author = await Author.findById(req.params.id).exec();
  if(author === null) {
    const err = new Error("Author not found");
    err.status = 404;
    return next(err);
  }

  res.render("author_form", {
    title: "Update Author", author 
  })
};

// 由 POST 处理作者创建操作
exports.author_update_post = [
  body("first_name")
    .trim()
    .isLength({min:1})
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("irst name has non-alphanumeric characters."),
  
  body("family_name")
    .trim()
    .isLength({min:1})
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  
  body("date_of_birth", "Invalid date of birth")
    .optional({values: "falsy"})
    .isISO8601()
    .toDate(),

  body("date_of_death", "Invalid date of death")
    .optional({values: "falsy"})
    .isISO8601()
    .toDate(),
  
  asyncHandler(async (req, res, next)=>{
    const errors = validationResult(req);

    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
      _id: req.params.id,
    });

    if(!errors.isEmpty()) {
      res.render("author_form", {
        title: "Update Author",
        author: author,
        errors: errors.array(),
      });
      return;
    }

    await Author.findByIdAndUpdate(req.params.id, author);
    res.redirect(author.url);
  }),

];

