import mongoose from "mongoose";
/*
    [
        {
            _id: ObjectId('68968153fd770eecf66c4bd0'),
            username: 'ahmed',
            publicKey: 'pubA',
            privateKey: 'privA',

            friends: [
                { publicKey: 'friendOneKey' },
                { publicKey: 'friendTwoKey' }
            ],

            incomingRequests: [
                { publicKey: 'friendThreeKey', createdAt: ISODate("2025-08-09T12:00:00Z") }
            ],

            outgoingRequests: [
                { publicKey: 'friendFourKey', createdAt: ISODate("2025-08-09T12:05:00Z") }
            ]
        }
    ]
*/

const userSchema = new mongoose.Schema({
	username: String,
	publicKey: { type: String, unique: true },
	privateKey: { type: String, unique: true },

	// accepted
	friends: [
		{
			publicKey: String,
		},
	],

	// requests received from others
	incomingRequests: [
		{
			publicKey: String,
			createdAt: { type: Date, default: Date.now },
		},
	],

	// requests sent to others
	outgoingRequests: [
		{
			publicKey: String,
			createdAt: { type: Date, default: Date.now },
		},
	],
});
export default mongoose.model("User", userSchema);