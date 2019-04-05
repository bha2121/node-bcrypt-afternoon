const bcrypt = require('bcryptjs')

module.exports = {
    register: async (req, res) => {
        const { username, password, isAdmin } = req.body
        
        const db = req.app.get('db')
        let response = await db.get_user(username)
        let user = response[0]

        if(user) {
            return res.status(409).send('username already used')
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        let createdUserResponse = await db.register_user(isAdmin, username, hash)
        let createdUser = createdUserResponse[0]

       

        req.session.user = {isAdmin: createdUser.is_admin, username: createdUser.username, id: createdUser.id}
        res.send(req.session.user)
    },

    login: async (req, res) => {
        let { username, password } = req.body
        let db = req.app.get('db')

        let userResponse = await db.get_user(username)
        let user = userResponse[0]

        if(!user) {
            return res.status(401).send('username not found')
        }

        const isAuthenticated = bcrypt.compareSync(password, user.hash)

        if(!isAuthenticated) {
            return res.status(403).send('incorrect password')
        }

        req.session.user = {isAdmin: user.is_admin, username: user.username, id: user.id}
        res.send(req.session.user)
    },

    logout: (req, res) => {
        req.session.destroy()
        res.sendStatus(200)
    }
}
