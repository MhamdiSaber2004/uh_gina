const jwt = require('jsonwebtoken');
function getIDFromToken(token) {
  try {
    
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id; // tu peux aussi retourner decoded directement
  } catch (err) {
    console.error("Token invalid or expired:", err.message);
    return null;
  }
}

module.exports =  getIDFromToken ;