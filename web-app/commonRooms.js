var mongoose = require('mongoose');

// the host:port must match the location where you are running MongoDB
// the "myDatabase" part can be anything you like
mongoose.connect('mongodb://127.0.0.1:27017/myDatabase');

var Schema = mongoose.Schema;

var roomSchema = new Schema({
   roomName: { type: String, required: true, unique: true },
   capacity: { type: Number, required: true, unique: false },
   dorm: { type: String, required: true, unique: false },
   floor: { type: Number, required: true, unique: false },
   timeSlots: { type: String, required: true, unique: false },
   dateSlots: { type: String, required: true, unique: false },
   avail: { type: String, required: true, unique: false },
   numReserve: { type: Number, required: true, unique: false }
});

// export commonRoomSchema as a class called CommonRoom
module.exports = mongoose.model('CommonRoom', roomSchema);

roomSchema.methods.standardizeName = function () {
   this.name = this.name.toLowerCase();
   return this.name;
}
