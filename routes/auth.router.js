const {check, validationResult} = require('express-validator')
const {Router} = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')

const Customer = require('../models/Customer')
const authRouter = Router()


authRouter.post('/register', [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Минимальная длина пароля 6 символов')
            .isLength({min: 6}),
        check('name').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректный данные при регистрации'
                })
            }

            const {name, email, password} = req.body

            const account = await Customer.findOne({email})
            if (account) {
                return res.status(400).json({message: 'Пользователь уже существует'})
            }
            const hashedPassword = await bcrypt.hash(password, 12)
            const newUser = new Customer({name, email, password: hashedPassword})
            await newUser.save()
            res.status(201).json({message: 'Пользователь создан'})
        } catch (e) {
            res.status(500).json({message: 'Ошибка'})
        }
    })

authRouter.post('/login', [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректный данные'
                })
            }

            const {email, password} = req.body
            const customer = await Customer.findOne({email})

            if (!customer) {
                return res.status(400).json({message: 'Пользователь не найден'})
            }
            const isMatch = await bcrypt.compare(password, customer.password)
            if (!isMatch) {
                return res.status(400).json({message: 'Неверный пароль, попробуйте снова'})
            }

            const token = jwt.sign(
                {userId: customer.id},
                config.get('jwtSecret'),
                {expiresIn: '2h'}
            )

            res.json({token, userId: customer.id})
        } catch (e) {
            res.status(500).json({message: 'Ошибка'})
        }
    }
)

authRouter.get("/:id", async (req, res) => {
    try {
        const user = await Customer.findOne({_id: req.params.id}).populate('posts');
        res.json(user)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

module.exports = authRouter