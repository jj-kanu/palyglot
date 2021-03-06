var express = require('express');
var router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

/* POST, sign up a user */
router.post("/", async (req, res) => {
	try {
		const user = new User(req.body)
		await user.save()
		return res.status(201).send(user)
	} catch (error) {
		console.log(error)
		return res.status(400).send(error)
	}
})

/* PUT, update current user details */
router.put('/me', auth, async (req, res) => {
	try {
		const user = await User.findOneAndUpdate({ userId: req.userId }, req.body, { new: true })
		if (!user) throw new Error("current user not found")
		return res.send(user)
	} catch (error) {
		console.log(error)
		return res.status(400).send(error)
	}
})

/* GET, return logged in user pofile */
router.get('/me', auth, async (req, res) => {
	try {
		const user = await User.findOne({ userId: req.userId })
		if (!user) throw new Error("current user not found")
		res.send(user)
	} catch (error) {
		console.log(error)
		return res.status(400).send(error)
	}
})

/* DELETE, delete current user */
router.delete('/me', auth, async (req, res) => {
	try {
		const user = await User.findOneAndDelete({ userId: req.userId });
		if (!user) throw new Error("current user not found")
		res.send(user)
	} catch (error) {
		res.status(500).send(error)
	}
})

module.exports = router;

/**
 * Source citation:
 * https://medium.com/swlh/jwt-authentication-authorization-in-nodejs-express
 * -mongodb-rest-apis-2019-ad14ec818122
 */