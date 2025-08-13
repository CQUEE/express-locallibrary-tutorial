const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {DateTime} = require("luxon");

const AuthorSchema = new Schema({
  first_name : {type:String, required:true, max:100},
  family_name: {type:String, required:true, max:100},
  date_of_birth:{type:Date},
  date_of_death: {type: Date}
});

// 虚拟属性'name'：表示作者全名
AuthorSchema.virtual("name").get(function(){
  return this.family_name + ", " + this.first_name;
});

// 虚拟属性'lifespan'：作者寿命
AuthorSchema.virtual("lifespan").get(function(){
  let lifetime_string = "";
  if(this.date_of_birth) {
    lifetime_string = DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
  }

  lifetime_string += "-";

  if(this.date_of_death) {
    lifetime_string += DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED);
  }
  return lifetime_string;
})

// 虚拟属性'url'：作者 URL
AuthorSchema.virtual("url").get(function(){
  return "/catalog/author/" + this._id;
})

AuthorSchema.virtual("date_of_birth_yyyy_mm_dd").get(function(){
  return DateTime.fromJSDate(this.date_of_birth).toISO();
})

AuthorSchema.virtual("date_of_death_yyyy_mm_dd").get(function(){
  return DateTime.fromJSDate(this.date_of_death).toISO();
})

module.exports = mongoose.model("Author", AuthorSchema);