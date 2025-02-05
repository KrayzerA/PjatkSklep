const authRoutes = require('./AuthRouter')
const roleRoutes = require('./RoleRouter')
const productsRoutes = require('./ProductsRouter')
const purchaseRoutes = require('./PurchaseRouter')
const subjectTypeRoutes = require('./SubjectTypeRouter')
const subjectRoutes = require('./SubjectRouter')
const specialistRoutes = require('./SpecialistRouter')
const userRoutes = require('./UserRouter')

module.exports = {
    authRoutes,
    roleRoutes,
    productsRoutes,
    purchaseRoutes,
    subjectRoutes,
    subjectTypeRoutes,
    specialistRoutes,
    userRoutes
}