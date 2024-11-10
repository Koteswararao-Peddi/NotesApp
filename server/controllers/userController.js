
const User = require('../models/user.model')


const getUser = async (req, res)=>{

    try {

        if (!req.user) {
            return res.status(401).json({
              message: "User not authenticated",
            });
          }

          const {user} = req.user

        const isUser = await User.findOne({_id: user._id})

        if (!isUser) {
            return res.status(404).json({
              message: "User not found",
            });
          }

        res.status(200).json({
            user:isUser,
            message: "success"
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal server Error"
        })
    }
}

module.exports = {getUser}