const { default: mongoose, model } = require("mongoose");
const {Datetime, DateTime} = require("luxon");

const Schema = mongoose.Schema;

const BookInstancecSchema = new Schema({
  book:{type:Schema.Types.ObjectId, ref:"Book", required:true},
  imprint:{type:String, required:true},
  status:{
    type:String,
    required:true,
    enum:["Available", "Maintenance", "Loaned", "Reserved"],
    default: "Maintenance",
  },
  due_back:{type:Date, default:Date.now}
})

// 虚拟属性'url'：藏书副本 URL
BookInstancecSchema.virtual("url").get(function(){
  return "/catalog/bookinstance/" + this._id;
});

BookInstancecSchema.virtual("due_back_formatted").get(function(){
  return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
})

BookInstancecSchema.virtual("due_back_yyyy_mm_dd").get(function(){
  return DateTime.fromJSDate(this.due_back).toISODate(); //format 'YYYY-MM-DD'
})

module.exports = mongoose.model("BookInstance", BookInstancecSchema);