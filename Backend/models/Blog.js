const mongoose = require('mongoose');
const slugify  = require('slugify')
// Blog model

const blogSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String,
    slug :{type:String,unique:true},
    createdAt: { type: Date, default: Date.now }
});

// blogSchema.pre("save",function(next){
//     if (!this.slug) {
//         this.slug = slugify(this.title, { lower: true, strict: true });
//     }
//     next();
// })

blogSchema.pre("save", function (next) {
    if (!this.slug || this.isModified("title")) { // Jab slug na ho ya title change ho
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model('Blog', blogSchema);
