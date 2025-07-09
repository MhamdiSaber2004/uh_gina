const  jwt  = require("jsonwebtoken");

exports.verifyclient = (req, res, next) => {
    const token = req.headers.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized access" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'client') {
            return res.status(403).json({ message: "Not a client" });
        }
        next();
    } catch (error) {
        console.error("Token verification error:", error); 
        return res.status(401).json({ message: "Invalid token" });
    }
}
exports.verifyLivreur = (req, res, next) => {
    const token = req.headers.token;
    
    if (!token) {
        return res.status(401).json({ message: "Unauthorized access" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'livreur') {
            return res.status(403).json({ message: "Not a livreur" });
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

exports.verifyAdmin = (req, res, next) => {
    const token = req.headers.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized access" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: "Not an admin" });
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}
