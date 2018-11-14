const jwt = require("jsonwebtoken")
const models = require("../models")



module.exports.isAuthenticated = (req,res, next) => {
    // check token
    const token = req.query.token || req.body.token || req.headers.authorization && req.headers.authorization.split(" ")[1] || undefined
    if(token === undefined){
        return res.send("token not found")
    }
    // decoded token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)


    // find account
    models.accounts.findOne({ 
        where : {
        id: decoded.id
    }})
    .then(accounts => {
        if(accounts === null){
            return res.send("account no found")
        }
        req.decoded = decoded
        next()
    })
    .catch(err => res.send(err))
    }catch (err) {
        res.send("token error")
    }
    
    
    

  
}