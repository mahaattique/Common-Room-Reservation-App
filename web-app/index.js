// set up Express
var express = require('express');
var app = express();

// set up BodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// import the User class from User.js
var Users = require('./Users.js');
var Room = require('./commonRooms.js');
var Reservations = require('./Reservations.js')
const e = require('express');

/***************************************/

app.use('/hello', (req, res) => {
	res.send("Hello World");
});

// endpoint for creating a new person
// this is the action of the "create new person" form
app.use('/signup', (req, res) => {

});

app.use('/login', (req, res) => {

});

//endpoint for creating a new user from android app
app.use('/addUserAccount', (req, res) =>{
	var newUser = new Users ({
		firstName: req.query.firstName,
		lastName: req.query.lastName,
		id: req.query.id,
		classYear: req.query.classYear,
		collegeEmail: req.query.collegeEmail,
		password: req.query.password,
		role: req.query.role
	});
	
	// save the user to the database
	newUser.save( (err) => { 
		if (err) {
			res.type('html').status(200);
			res.write('uh oh: ' + err);
			console.log(err);
			res.end();
		}
	});
});

//endpoint for creating a new user from "Add Reservations" request form
app.use('/addUserReservation', (req, res) => {
	var newReservation = new Reservations({
		userEmail: req.query.userEmail,
		roomName: req.query.roomName,
		dorm: req.query.dorm,
		floor: req.query.floor,
		date: req.query.date,
		time: req.query.time
	});
	
	// save the reservation to the database
	newReservation.save((err) => {
		if (err) {
			res.type('html').status(200);
			res.write('uh oh: ' + err);
			console.log(err);
			res.end();
		}
		else {
			// display the "successfull created" message
			//res.send('successfully added ' + newUser.id + ' to the database');
			res.redirect('/allReservations')
		}
	});
});

//endpoint for creating a new user from "Add User" request form
app.use('/addUser', (req, res) =>{
	var newUser = new Users ({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			id: req.body.id,
			classYear: req.body.classYear,
			collegeEmail: req.body.collegeEmail,
			password: req.body.password,
			role: req.body.role
		    });

		// save the user to the database
		newUser.save( (err) => { 
		if (err) {
		    	res.type('html').status(200);
		    	res.write('uh oh: ' + err);
		    	console.log(err);
		    	res.end();
		}
		else {
			 // display the "successfull created" message
			//res.send('successfully added ' + newUser.id + ' to the database');
			res.redirect('/public/redirect.html')
		}
	});
});

// endpoint for showing all the users enrolled in the database
app.use('/allUsers', (req, res) => {
	Users.find( {}, (err, u) => {
		if (err) {
		    res.type('html').status(200);
		    console.log('uh oh' + err);
		    res.write(err);
		}
		else {
		    if (u.length == 0) {
			res.type('html').status(200);
			res.write('There are no users in the database.');
			res.end();
			return;
		    }
			
		    else {
			res.type('html').status(200);
			res.write('Here are the users in the database:');
			res.write('<ul>');
			// show all the users
			u.forEach( (user) => {
			    res.write('<li>');
			    res.write('Name: ' + user.firstName + " " + user.lastName + '; user ID: ' + user.id + '; graduation year: ' + user.classYear + '; email: ' + user.collegeEmail + '; user role: ' + user.role + "; password " + user.password);
			    // this creates a link to the /delete endpoint
			    res.write(" <a href=\"/deleteUser?user=" + user.userID + "\">[Delete]</a>");
			    res.write('</li>');
					 
			});
			res.write('</ul>');
			res.end();
		    }
		}
	}).sort({ 'user.id' : 'asc' });
});

app.use('/editUser', (req, res) => {
	var changedUser = { 'collegeEmail': req.query.collegeEmail };// User we are updating
	let user = {};
	Users.findOne(changedUser, (err, result) => {
		if (err) {
			user = {};
		}
		if (result == null) {
			user = result;
		}
	});
	Users.findOneAndUpdate(changedUser, {
		$set: {
			firstName: req.query.firstName ? req.query.firstName : changedUser.firstName,
			lastName: req.query.lastName ? req.query.lastName : changedUser.lastName,
			classYear: req.query.classYear ? req.query.classYear : changedUser.classYear,
			password: req.query.password ? req.query.password : changedUser.password,
		}
	},
		(err, result) => {
			if (err) {
				res.type('html').status(200);
				console.log(err);

			}
			if (result == null) {
				res.type('html').status(200);
				console.log("original information found " + err);

			} else {
				//res.redirect('/allUsers');
			}
		}
	);
}
);

app.use('/users', (req, res) => {
	Users.find({}, (err, u) => {
		// console.log(u);
		if (err) {
			console.log(err);
			res.json({});
		}
		else if (u.length == 0) {
			res.json({});
		}
		else {
			var returnArray = [];
			u.forEach( (users) => {
				returnArray.push({ "collegeEmail": users.collegeEmail, "password": users.password, "firstName": users.firstName, "lastName": users.lastName, "id": users.id, "classYear": users.classYear });
			});
			res.json(returnArray);
		}
	});
});

//endpoint for deleting a user in the app
app.use('/deleteAppUser', (req, res) => {
	var User = { 'collegeEmail': req.query.collegeEmail };
	Users.findOneAndDelete(User, (err, u) => {
		if (err) {
			console.log("error" + err);
		} else if (!u) {
			console.log("not a user" + err);
		}
		else {
			console.log("success");
		}
	});
	//res.send('successfully deleted user from the database');
});


//endpoint for deleting a user
app.use('/deleteUser', (req, res) => {
		var User = {'Users' : req.query.Users};
	Users.findOneAndDelete(User, (err, u) => {
		 if (err) {
			 console.log("error" + err);
		 } else if (!u) {
			 console.log("not a user" + err);
		 }
	 });
	 //res.send('successfully deleted user from the database');
	 res.redirect('/allUsers');
});

// endpoint for showing all the users enrolled in the database
app.use('/allReservations', (req, res) => {
	Reservations.find( {}, (err, r) => {
		if (err) {
		    res.type('html').status(200);
		    console.log('uh oh' + err);
		    res.write(err);
		}
		else {
		    if (r.length == 0) {
			res.type('html').status(200);
			res.write('There are no reservations in the database.');
			res.end();
			return;
		    }
		    else {
			res.type('html').status(200);
			res.write('Here are the reservations in the database:');
			res.write('<ul>');
			// show all the users
			r.forEach( (reserv) => {
			    res.write('<li>');
			    res.write('User email: ' + reserv.userEmail + '; Room Name: ' + reserv.roomName + '; Dorm: ' + reserv.dorm + '; Floor: ' + reserv.floor + '; Date: ' + reserv.date + '; Time: ' + reserv.time);
			    // this creates a link to the /delete endpoint
			    res.write(" <a href=\"/deleteRes?reserv=" + reserv.reservroomName + "\">[Delete]</a>");
				res.write(" <a href=\"/public/editReservations.html\">[Edit]</a>");
				res.write(" <a href=\"/public/reservationAddForm.html\">[Back to Add Reservation]</a>");
			    res.write('</li>');
			});
			res.write('</ul>');
			res.end();
		    }
		}
	    }).sort({ 'reserv.roomName' : 'asc' });
});
//endpoint for creating a new user from "Add Reservations" request form
app.use('/addReservation', (req, res) =>{
	var newReservation = new Reservations ({
			userEmail: req.body.userEmail,
			roomName: req.body.roomName,
			dorm: req.body.dorm,
			floor: req.body.floor,
			date: req.body.date,
			time: req.body.time
		    });

		// save the user to the database
		newReservation.save( (err) => { 
		if (err) {
		    	res.type('html').status(200);
		    	res.write('uh oh: ' + err);
		    	console.log(err);
		    	res.end();
		}
		else {
			 // display the "successfull created" message
			//res.send('successfully added ' + newUser.id + ' to the database');
			res.redirect('/allReservations')
		}
	});
});

app.use('/reservation', (req, res) => {
	Reservations.find({}, (err, r) => {
		// console.log(u);
		if (err) {
			console.log(err);
			res.json({});
		}
		else if (r.length == 0) {
			res.json({});
		}
		else {
			var returnArray = [];
			r.forEach( (rsv) => {
				returnArray.push({ "userEmail": rsv.userEmail, "roomName": rsv.roomName, "dorm": rsv.dorm, "floor": rsv.floor, "date": rsv.date, "time": rsv.time });
			});
			res.json(returnArray);
		}
	});
});

// endpoint for deleting a reservation in app (separate from the delete res for the website)
app.use('/deleteResApp', (req, res) => {
	var userEmail = { 'userEmail': req.query.userEmail };
	Reservations.findOneAndDelete(userEmail, (err, res) => {
		if (err) {
			console.log(err);
		} else if (!res) {
			console.log("no user reservation made" + err);
		}
	});
	res.redirect('/allReservations');
});


// endpoint for deleting a reservation
app.use('/deleteRes', (req, res) => {
	var Reservation = {'Reservations' : req.query.Reservations};
	Reservations.findOneAndDelete(Reservation, (err, res) => {  
		if (err) {
			console.log(err);
		} else if (!res) {
			console.log("no reservation made" + err);
		}
	});
	res.redirect('/allReservations'); 
});

// editing the reservation info
app.use('/editRes', (req, res) => {
	var Reservation = {'Reservations' : req.query.Reservations}; // common room we are updating
	let reservation = {};
		Reservations.findOne(Reservation, (err, result) => {
			if (err) {
				reservation = {};
			}  
			if (result == null) {
				reservation = result;
			}
		});
		Reservations.findOneAndUpdate(Reservation, { $set: {
			roomName: req.body.roomName ? req.body.roomName : reservation.roomName,
			dorm: req.body.dorm ? req.body.dorm : reservation.dorm,
			floor: req.body.floor ? req.body.floor : reservation.floor,
			date: req.body.date ? req.body.date : reservation.date,
			time: req.body.time ? req.body.time : reservation.time }},
			(err, result) => {
				if (err) {
					res.type('html').status(200);
					console.log(err);
					
				} 
				if (result == null) {
					res.type('html').status(200);
					console.log("original information found "+ err);
					
				} else {
					//res.send('successfully updated the common room information');
					res.redirect('/allReservations');
					//return;
				}
			}
		);
	}
)

// endpoint for showing all the common rooms in the database
app.use('/allRooms', (req, res) => {
	Room.find( {}, (err, cR) => {
		if (err) {
		    res.type('html').status(200);
		    console.log('uh oh' + err);
		    res.write(err);
		}
		else {
		    if (cR.length == 0) {
				res.type('html').status(200);
				res.write('There are no common rooms');
				res.end();
				return;
		    }
		    else {
				res.type('html').status(200);
				res.write('Here are the common rooms in the database:');
				res.write('<ul>');
				// show all the common rooms
				cR.forEach( (commonroom) => {
					res.write('<li>');
					res.write('Name: ' + commonroom.roomName + '; capacity: ' + commonroom.capacity + '; dorm name: ' + commonroom.dorm + '; floor number: ' + commonroom.floor + '; time slots: ' + commonroom.timeSlots + '; dates : ' + commonroom.dateSlots + '; availability : ' + commonroom.avail + '; reservations limit : ' + commonroom.numReserve);
					// this creates a link to the /delete endpoint
					res.write(" <a href=\"/delete?name=" + commonroom.roomName + "\">[Delete]</a>");
					res.write(" <a href=\"/public/editCommonRoom.html\">[Edit]</a>");
					res.write('</li>');
				});
				res.write('</ul>');
				res.end();
		    }
		}
	}).sort({ 'dorm': 'asc' });
});


//Endpoint to send back specified dorm common rooms for app
app.use('/rooms', (req, res) => {

	
	Room.find( {}, (err, rooms) => {
		console.log(rooms);
		if (err) {
		    console.log('uh oh' + err);
		    res.json({});
		}
		else if (rooms.length == 0) {
		    // no objects found, so send back empty json
		    res.json({});
		}
		else {
		    // construct an array out of the result
		    var returnArray = [];
		    rooms.forEach( (room) => {
			    returnArray.push( { "name" : room.roomName , "capacity" : room.capacity, "dorm" : room.dorm,
				"floor" : room.floor, "timeSlots" : room.timeSlots,"dateSlots" : room.dateSlots, "avail" : room.avail, " numReserve" : room.numReserve } );
			});
		    // send it back as JSON Array
		    res.json(returnArray); 
		}
    });
});
//endpoint for creating a new common room from "Common Room" request form
app.use('/create', (req, res) =>{
	var newCommonRoom = new Room ({
			roomName: req.body.name,
			capacity: req.body.capacity,
			dorm: req.body.dorm,
			floor: req.body.floor,
			timeSlots: req.body.timeSlots,
			dateSlots: req.body.dateSlots,
			avail: req.body.avail,
			numReserve: req.body.numReserve
		    });

		// save the Common Room to the database
		newCommonRoom.save( (err) => { 
		if (err) {
		    	res.type('html').status(200);
		    	res.write('uh oh: ' + err);
		    	console.log(err);
		    	res.redirect('/allRooms')
		}
		else {
			 // display the "successfull created" message
			//res.send('successfully added ' + newCommonRoom.roomName + ' to the database');
			res.redirect('/allRooms')
		}
	});
});

//endpoint for deleting a common room
app.use('/delete', (req, res) => {
       var CommonRoom = {'CommonRoom' : req.query.CommonRoom};
	Room.findOneAndDelete(CommonRoom, (err, room) => {
		if (err) {
			console.log("error" + err);
		}
		else if (!room) {
			console.log("not a common room" + err);
		}
	});
	//res.send('successfully deleted common room from the database');
	res.redirect('/allRooms');
});

// editing the name, capacity, floor and timeslots of a communal space
app.use('/update', (req, res) => {
	var CommonRoom = {'CommonRoom' : req.query.CommonRoom}; // common room we are updating
	let commonroom = {};
		Room.findOne(CommonRoom, (err, result) => {
			if (err) {
				commonroom = {};
			}  
			if (result == null) {
				commonroom = result;
			}
		});
		Room.findOneAndUpdate(CommonRoom, { $set: {
			roomName: req.body.name ? req.body.name : commonroom.name,
			capacity: req.body.capacity ? req.body.capacity : commonroom.capacity,
			floor: req.body.floor ? req.body.floor : commonroom.floor,
			timeSlots: req.body.timeSlots ? req.body.timeSlots : commonroom.timeSlots,
			dateSlots: req.body.dateSlots ? req.body.dateSlots : commonroom.dateSlots,
			avail: req.body.avail ? req.body.avail : commonroom.avail,
			numReserve: req.body.numReserve ? req.body.numReserve : commonroom.numReserve }},
			(err, result) => {
				if (err) {
					res.type('html').status(200);
					console.log(err);
					
				} 
				if (result == null) {
					res.type('html').status(200);
					console.log("original information found "+ err);
					
				} else {
					//res.send('successfully updated the common room information');
					res.redirect('/allRooms');
					//return;
				}
			}
		);
	}
);

/*************************************************/

app.use('/public', express.static('public'));

app.use('/', (req, res) => { res.redirect('/public/home.html'); });

app.listen(3000, () => {
	console.log('Listening on port 3000');
});

