import mongoose from "mongoose";
/*
    [
        {
            _id: ObjectId('68968153fd770eecf66c4bd0'),
            username: 'ahmed',
            publicKey: 'pubA',
            privateKey: 'privA',
            friends: [
                { username: 'friends1', publicKey: 'friendOneKey' },
                { username: 'friends1', publicKey: 'friendOneKey' }
            ]
        }
    ]
*/

const userSchema = new mongoose.Schema({
	username: String,
	publicKey: { type: String, unique: true },
	privateKey: { type: String, unique: true },
	friends: [
		{
			username: String,
			publicKey: String,
		},
	],
});
export default mongoose.model("User", userSchema);