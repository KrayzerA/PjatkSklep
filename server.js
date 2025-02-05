const express = require('express')
const path = require("path");
const {
    authRoutes,
    productsRoutes,
    purchaseRoutes,
    roleRoutes,
    specialistRoutes,
    subjectRoutes,
    subjectTypeRoutes,
    userRoutes
} = require('./routes/AllRouters')
const mongoose = require('mongoose')
const dictionary = require('./dictionary.json')
mongoose.connect('mongodb+srv://s26793:qwerty12345@pjatksklep.3z6pt.mongodb.net/PJATKsklep?retryWrites=true&w=majority&appName=PJATKsklep')
    .then(() => console.log('connected to db'))
    .catch((err) => console.log('cant connect to db', err))

const app = express()
const port = 8000

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRoutes)//tested
app.use('/', specialistRoutes)//tested
app.use('/', purchaseRoutes)//tested
app.use('/', subjectRoutes)//tested
app.use('/', roleRoutes) //tested
app.use('/', subjectTypeRoutes)//tested
app.use('/', userRoutes)//tested
app.use('/', productsRoutes)//tested

app.get('/dictionary', (req, res) => {
    return res.json(dictionary);
})
app.listen(port, (error) => {
    if (error) {
        throw error;
    } else {
        console.log(`Server started on port ${port}`)
    }
})
