const Genre = require('../models/genre');
const asyncHandler = require('express-async-handler');
const Book = require('../models/book');
const async = require('async');
const genre = require('../models/genre');
const {body, validationResult} = require("express-validator");

exports.genre_list = asyncHandler(async (req, res, next)=>{
  const allGenres = await Genre.find().sort({ name: 1 }).exec();
  res.render("genre_list", {
    title: "Genre list",
    genre_list:allGenres
  });
})

exports.genre_detail = asyncHandler(async (req, res, next) => {

      const [genre, booksInGenre] = await Promise.all([
        Genre.findById(req.params.id).exec(),

        //这里的genre是字段名称，查找所有 genre 字段等于 req.params.id 的 Book 文档
        Book.find({genre: req.params.id}, "title summary").exec()
      ]);

      if(genre == null) {
        var err = new Error("Genre not found");
        err.status = 404;
        return next(err);
      }

      res.render("genre_detail", {
        title: "Genre Detail",
        genre: genre,
        genre_books: booksInGenre
      });

});

// 由 GET 处理作者创建操作
exports.genre_create_get = async (req, res, next)=>{
  res.render("genre_form", {title: "Create Genre"});
};

// 由 POST 处理作者创建操作
exports.genre_create_post = [
    body("name", "Genre name must contain at least 3 characters")
    .trim().isLength({min:3}).escape(),

    async(req, res, next)=>{
      const errors = validationResult(req);
      const genre = new Genre({name:req.body.name});

      if(!errors.isEmpty()) {
        res.render("genre_form"), {
          title:"Create Genre",
          genre:genre,
          errors:errors.array()
        }
        return;
      }

      const genreExists = await Genre.findOne({name:req.body.name})
            .collation({locale:"en", strength:2})
            .exec();
      if(genreExists) {
        res.redirect(genreExists.url);
        return;
      }

      // 保存新创建的 Genre，然后重定向到类型的详情页面
      await genre.save();
      res.redirect(genre.url);
    }
];


// 由 GET 显示删除作者的表单
exports.genre_delete_get = async (req, res, next)=>{
  const [genre, booksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({genre: req.params.id }, "title summary").exec(),
  ]);

  if(genre === null) {
    res.redirect("/catalog/genres");
  }

  res.render("genre_delete", {
    title: "Delete Genre",
    genre,
    genre_books: booksInGenre,
  })
};
// 由 POST 处理作者删除操作
exports.genre_delete_post = async (req, res, next)=>{
  const [genre, booksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({genre: req.params.id }, "title summary").exec(),
  ]);

  if(booksInGenre.length > 0) {
    res.render("genre_delete", {
      title: "Delete Genre",
      genre,
      genre_books: booksInGenre,
    });
    return;
  }

  await Genre.findByIdAndDelete(req.body.id);
  res.redirect("/catalog/genres");
};

// 由 GET 处理作者创建操作
exports.genre_update_get = async (req, res, next)=>{
  const genre = await Genre.findById(req.params.id).exec();
  if(genre === null) {
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }
  res.render("genre_form", {title: "Update Genre", genre});
};

// 由 POST 处理作者创建操作
exports.genre_update_post = [
    body("name", "Genre name must contain at least 3 characters")
    .trim().isLength({min:3}).escape(),

    async(req, res, next)=>{
      const errors = validationResult(req);
      const genre = new Genre({
        name:req.body.name,
        _id: req.params.id});

      if(!errors.isEmpty()) {
        res.render("genre_form"), {
          title:"Update Genre",
          genre:genre,
          errors:errors.array()
        }
        return;
      }

      await Genre.findByIdAndUpdate(req.params.id, genre);
      res.redirect(genre.url);
    }
];