import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		contact: {
			type: String,
		},
		password: {
			type: String,
			required: function () {
				return !this.googleId;
			},
		},
		fullName: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ["buyer", "seller"],
			default: "buyer",
		},
		googleId: {
			type: String,
		},
		profilePicture: {
			type: String,
			default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
		},
	},
	{ timestamps: true },
);

userSchema.pre("save", async function () {
	if (!this.isModified("password")) return;
	const hash = await bcrypt.hash(this.password, 10);
	this.password = hash;
});

userSchema.methods.comparePassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("User", userSchema);

export default userModel;
