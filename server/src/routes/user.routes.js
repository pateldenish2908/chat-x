const express = require('express');
const router = express.Router();
const {
    addUser,
    updateUser,
    deleteUser,
    getUserById,
    getAllUsers,
    seedUsers,
    getUserWithPaginationSearchingAndSorting,
    getNearbyUsers,
} = require('../controllers/user.controller');

router.get('/nearby', getNearbyUsers);
router.post('/', addUser);
router.put('/:id', updateUser);
router.delete(':id', deleteUser);
router.get('/getAll', getAllUsers);
router.get('/:id', getUserById);
router.get('/', getUserWithPaginationSearchingAndSorting);
router.post('/seedUsers', seedUsers);



module.exports = router;