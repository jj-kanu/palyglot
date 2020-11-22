var express = require('express');
var router = express.Router();
const Room = require('../models/Room');


/* GET, uses pagination to return at most 30 of the most recent messages in the 
room. Room ID must be passed in the request with the room parameter. 
The messages returned must have been sent before the date in the beforeDate
parameter. */

// router.get("/", async (req, res) => {
// 	await Message.find({to: req.query.room, date: 
// 		{"$lt": new Date(req.query.beforeDate)}})
// 	.sort('-date').limit(30)
// 	.exec((err, docs) => {
// 		if (err) return res.json(err);
// 		return res.json(docs);
// 	})
// });

/* get all of the stored messages for a room */
router.get("/", async (req, res) => {
	let roomId = req.query.roomId;
	await  Room.findOne({id: roomId}).exec((err, room) => {
		if (err) return res.json(err);
		let messages = room.messages;
		messages.sort(function(a,b) {
			return new Date(b.date) - new Date(a.date);
		})
		return res.json(messages);
	});
})
/* POST, add a new message to the room */
router.post("/", async (req, res) => {
	const message = {
		text: req.body.text,
		date: req.body.date,
		from: req.body.from,
		to: req.body.to
	};

	let roomId = req.body.roomId;
	await Room.findOne({id: roomId}).exec((err, room) => {
		if (err) return res.json(err);
		room.messages = [...room.messages, message];
		room.save();
		res.json({msg: "success"});
	})
});

module.exports = router;