const models = require("../models")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.getAll = (req, res) => {
    models.accounts
        .findAll()
        .then(accounts => {
            if (accounts === []) {
                res.send("data not fund")
            } else {
                res.send(accounts)
            }
        })
        .catch(err => res.send(err))
}

exports.post = (req, res) => {
    // ngacak password
    const SALT_WORK_FACTOR = 7
    const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR)
    req.body.password = bcrypt.hashSync(req.body.password, salt)
    //-------------------------------------------------------------------

    models.accounts
        .create(req.body)
        .then(account => res.send({
            message: "insert data success",
            data: account
        }))
        .catch(err => res.send(err))
}

exports.login = (req, res) => {
    console.log(req.body.email)
    models.accounts.findOne({
            where: {
                email: req.body.email
            }
        })
        .then(account => {
            if (account === null) {
                return res.send("account not found")
            }

            const validPassword = bcrypt.compareSync(req.body.password, account.password)
            console.log("test")
            if (validPassword === false) {
                return res.send("password not valid")
            }

            const token_data = {
                payload: {
                    id: account.id,
                    name: account.name
                },
                secret: process.env.JWT_SECRET,
                options: {
                    expiresIn: "7d"
                }
            }

            const token = jwt.sign(token_data.payload, token_data.secret, token_data.options)

            res.send({
                message: "you are loggin",
                id: account.id,
                token: token
            })


        })
        .catch(err => {
            res.send(err)
        })
}

exports.deleteOne = (req, res) => {
    models.accounts.findOne({
            where: {
                id: req.params.id
            }
        })
        .then(account =>
            account.destroy()
            .then(result => res.send(result))
            .catch(err => res.send(err)))
        .catch(err => res.send(err))

    // models.accounts.destroy({
    //     where: { id: req.params.id }
    // }).then(result => {
    //     if (result === 1) {
    //         res.send("success")
    //     } else {
    //         res.send("failed")
    //     }
    // }).catch(err => res.send(err))
}

exports.deleteAll = (req, res) => {

    models.accounts.destroy({
        where: {},
        truncate: true
    }).then(result => {
        res.send("success")
    }).catch(err => res.send(err))
}

exports.search = (req, res) => {
    console.log(req.query)
    models.accounts.findAll({
            where: req.query
        })
        .then(accounts => res.send(accounts))
        .catch(err => res.send(err))
}

exports.update = (req, res) => {
    models.accounts.update(req.body, {
            where: {
                id: req.params.id
            }
        }).then(result => res.send(result))
        .catch(err => res.send(err))
}