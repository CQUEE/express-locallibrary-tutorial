const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GenreSchema = new Schema({
  name : {type:String, required:true, max:100, min:3},
});

// 虚拟属性'url'：种类 URL
GenreSchema.virtual("url").get(function(){
  return "/catalog/genre/" + this._id;
})


module.exports = mongoose.model("Genre", GenreSchema);