
const JWT = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const token = req.cookies["token"]
    if (!token) {
      console.log("no token")
      return res.status(401).json({
        message: "Token Required",
        })
    }
  
    JWT.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(401).json({
          message: "Unauthorized",
          })
      }
  
      req.user = user
      next()
    })
  }

module.exports = verifyToken