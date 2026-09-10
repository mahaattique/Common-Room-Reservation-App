var mongoose = require('mongoose');

// the host:port must match the location where you are running MongoDB
// the "myDatabase" part can be anything you like
mongoose.connect('mongodb://127.0.0.1:27017/myDatabase'); 

var Schema = mongoose.Schema;

var reserveSchema = new Schema({
   userEmail: { type: String, required: true, unique: false },
   roomName: { type: String, required: true, unique: false },
   dorm: { type: String, required: true, unique: false },
   floor: { type: Number, required: true, unique: false },
   date: { type: String, required: true, unique: false },
   time: { type: String, required: true, unique: false }
});

// export userSchema as a class called Users
module.exports = mongoose.model('Reservations', reserveSchema);
