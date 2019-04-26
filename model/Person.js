const mongoose = require('mongoose');

const PersonSchema = new mongoose.Schema({
 name:{
        type: String,
        required:true
 },
 organization:{
     type:String,
     required: true
 },
 designation: {
     type: String,
     required: true
 }
});

const Person = mongoose.model('persons', PersonSchema);

module.exports= Person;