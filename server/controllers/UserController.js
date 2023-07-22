import UserModel from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Get a user
export const getUser = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await UserModel.findById(id);
        if (user) {
            const { password, ...otherDetails } = user._doc;
            res.status(200).json(otherDetails);
        } else {
            res.status(404).json("No such User");
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

// Get all users
export const getAllUsers = async  (req, res) => {
    try {
        let users = await UserModel.find();
        users = users.map((user) => {
            const { password, ...otherDetails } = user._doc;
            return otherDetails;
        })
        res.status(200).json(users);
    } catch (err) {
        res.status(400).json({ message: err})
    }
}

// Delete a user
export const deleteUser = async (req, res) => {
    const idUser = req.params.id;

    const { currentUser, currentAdmin } = req.body;
    
    if (currentUser == id || currentAdmin) {
        try {
            await UserModel.findByIdAndDelete(id);
            res.status(200).json("User deleted successfully");
        } catch (error) {
            res.status(404).json({ message: error})
        }
    }
};

// Update a user
export const updateUser = async (req, res) => {
    const idUser = req.params.id;
    const { _id , currentUserAdmin, password } = req.body;
    if (idUser === _id) {
        try {
            // if we also have to update password then password will be bcrypted again
            if (password) {
               const salt = await bcrypt.getnSalt(10);
               req.body.password = await bcrypt.hash(password, salt);
            }
            const user = await UserModel.findByIdAndUpdate(idUser, req.body, {
                new: true,
            });
            const token = jwt.sign(
                { username: user.username, id: user._id },
                 process.env.JWT_TOKEN,
                { expiresIn: "1h"}
            );
            res.status(200).json({ user, token });
         } catch (e) {
            res.status(400).json(e);
        }
    } else {
        res.status(400).json("Access Denied ! You can update the account");
    }
};

// Follow a User
export const followUser = async (req, res) => {
    const id = req.params.id;
    const { _id } = req.body;
    console.log(id, _id)
    if (_id == id) {
        res.status(403).json("Action Forbidden");
    } else {
        try {
            const followUser = await UserModel.findById(id);
            const followingUser = await UserModel.findById(_id);

            if (!followUser.followers.includes(_id)) {
                await followUser.updateOne({ $push: { followers: _id } });
                await followingUser.updateOne({ $push: { following: id } });
                res.status(200).json("User followed!");
            } else {
                res.status(403).json("you are already following this id");
            }
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }
    }
};

// Unfollow a User
export const unfollowUser = async (req, res, next) => {
    const id = req.params.id;
    const { _id } = req.body;

    if(_id === id)
    {
        res.status(403).json("Action Forbidden")
    }
    else{
        try {
            const unFollowUser = await UserModel.findById(id)
            const unFollowingUser = await UserModel.findById(_id)


            if (unFollowUser.followers.includes(_id))
            {
                await unFollowUser.updateOne({$pull : {followers: _id}})
                await unFollowingUser.updateOne({$pull : {following: id}})
                res.status(200).json("Unfollowed Successfully!")
            }
            else{
                res.status(403).json("You are not following this User")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
};
