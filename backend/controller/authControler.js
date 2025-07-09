const User = require('../model/userModel');

exports.login = async (req, res) => {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
        return res.status(400).json({ message: "Phone number and password are required" });
    }

    try {
        const user = await User.findOne({ phoneNumber }).select('+password');
        if (!user) {
            return res.status(401).json({ message: "Invalid phone number or password" });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid phone number or password" });
        }

        const token = user.getSignedJwtToken();
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                phoneNumber : user.phoneNumber,
                adress : user.adress,
                role: user.role
            }
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

exports.register = async (req, res) => {
    const { name, phoneNumber, adress ,password} = req.body;

    if (!name || !phoneNumber || !password || !adress) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await User.findOne({ phoneNumber });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = new User({
            name,
            phoneNumber,
            adress,
            password,
            role:'client' // Default to 'client' if no role is provided
        });

        await user.save();

        const token = user.getSignedJwtToken();
        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

exports.modifyUser = async (req, res) => {
    const { name, phoneNumber, adress ,password , verifPassword} = req.body;
    console.log(req.body);
    const userId = req.params.id;

    if( password !== verifPassword && password != "") {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        const user = await User.findById(userId).select('+password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if(name == ""){
            user.name = user.name;
        }else {
            user.name = name;
        }
        if(phoneNumber == ""){
            user.phoneNumber = user.phoneNumber;
        }else {
            user.phoneNumber = phoneNumber;
        }
        if(adress == ""){
            user.adress = user.adress;
        } else {
            user.adress = adress;
        }
        if(password == "") {
            user.password = user.password;
        }else {
            user.password = password;
        }
        await user.save();

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: {
                id: user._id,
                name: user.name,
                phoneNumber: user.phoneNumber,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

exports.AddLivreur = async (req, res) => {
    const { name, phoneNumber ,password  } = req.body;
    if (!name || !phoneNumber || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await User.findOne({ phoneNumber });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = new User({
            name,
            phoneNumber,
            password,
            role: 'livreur' // Default to 'client' if no role is provided
        });

        await user.save();

        res.status(201).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

exports.getUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                phoneNumber: user.phoneNumber,
                adress: user.adress,
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}



exports.getAllClients = async (req, res) => {
    try {
        const users = await User.find({role : "client"}).select('-password');
        res.status(200).json({
            success: true,
            users: users
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

exports.getAllLivreurs = async (req, res) => {
    try {
        const users = await User.find({role : "livreur"}).select('-password');
        res.status(200).json({
            success: true,
            users: users
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

exports.getAllAdmins = async (req, res) => {
    try {
        const users = await User.find({role : "admin"}).select('-password');
        res.status(200).json({
            success: true,
            users: users
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}