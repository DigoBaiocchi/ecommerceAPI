const express = require('express');
const router = express.Router();
const { Database } = require('../db/databaseQueries');

// mock database
const categories = [{id: 1, name: 'Pork'}];

router.get('/', async (req, res, next) => {
    const categories = await Database.getAllCategories();
    if (categories.length !== 0) {
        console.log(categories)
        return res.status(200).json('All categories are loaded');
    }
    return res.status(400).json('No categories found');
});

router.post('/add-category', (req, res, next) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json('Category name not provided');
    }

    const existentCategory = categories.some(category => category.name === name);
    if (existentCategory) {
        return res.status(400).json('Category already exists');
    }
    categories.push({id: 2, name: name});
    return res.status(201).json(`Category ${name} successfully created`);
});

router.put('/edit-category', (req, res, next) => {
    const { id, name } = req.body;
    if (!name) {
        return res.status(400).json(`Name not provided for category ${id}`);
    }

    return res.status(200).json(`Category ${id} has been updated to ${name}`);
});

router.delete('/delete-category/:id', (req, res, next) => {
    const { id } = req.params;
    const existentCategory = categories.some(category => category.id === Number(id));
    if (!existentCategory) {
        return res.status(400).json("Category does not exist");
    }
    return res.status(200).json("Category has been deleted");
});


module.exports = router;