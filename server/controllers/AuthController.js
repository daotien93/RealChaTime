import UserModel from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel";

// Register new account
export  const registerUser = async (req, res) => {
    const saltPassword = await  bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, saltPassword);
    req.body.password = hashedPassword;
    const newUser = new UserModel(req.body);
    const { username } = req.body;
    try {
        // addition new
        const oldUser = await  UserModel.findOne({ username });

        if (oldUser)
            return res.status(400).json({ message: "User already exists"});

            // Changed
            const user = await newUser.save();
            const token = jwt.sign(
                { username: user.username, id: user._id },
                 process.env.JWT_TOKEN,
                { expiresIn: "1h" }
            );
            res.status(200).json({ user, token });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
};

//Login user
export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await UserModel.findOne({ username: username });
        if (user) {
            const validity = await bcrypt.compare(password, user.password);

            if (!validity) {
                res.status(400).json({ message: "wrong password"});
            } else {
                const token = jwt.sign(
                    { username: user.username, id: user._id },
                    process.env.JWT_TOKEN,
                    { expiresIn: "1h" }
                );
                res.status(200).json({ user, token});
            }
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};
