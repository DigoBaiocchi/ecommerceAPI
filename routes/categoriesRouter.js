const express = require('express');
const router = express.Router();
const { Database } = require('../db/databaseQueries');

// mock database
const categories = [{id: 1, name: 'Pork'}];

router.get('/', async (req, res, next) => {
    const categories = await Database.getAllCategories();
    console.log(categories)
    if (categories.length !== 0) {
        return res.status(200).json('All categories are loaded');
    }
    return res.status(400).json('No categories found');
});

router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    const category = await Database.getCategoryById(id);
    if (!category) {
        return res.status(400).json(`Category ${id} not found`)
    }
    return res.status(200).json(`Category ${id} selected`);
});

router.post('/add-category', async (req, res, next) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json('Category name not provided');
    }
    const categories = await Database.getAllCategories();
    const existentCategory = categories.some(category => category.name === name);
    if (existentCategory) {
        return res.status(400).json('Category already exists');
    }
    const addCategory = await Database.addCategory(name);
    return res.status(201).json(`Category ${name} successfully created`);
});

router.put('/edit-category', async (req, res, next) => {
    const { id, name } = req.body;
    if (!name) {
        return res.status(400).json(`Name not provided for category ${id}`);
    }
    
    const categories = await Database.getAllCategories();
    const existentCategory = categories.some(category => category.id === id);
    if(!existentCategory) {
        return res.status(200).json(`Category ${id} does not exist`);
    }

    const updateCategory = await Database.updateCategory(id, name);
    return res.status(200).json(`Category ${id} has been updated to ${name}`);
});

router.delete('/delete-category/:name', async (req, res, next) => {
    const { name } = req.params;
    const categories = await Database.getAllCategories();
    const existentCategory = categories.some(category => category.name === name);
    if (!existentCategory) {
        return res.status(400).json("Category does not exist");
    }
    const deleteCategory = await Database.deleteCategory(name);
    return res.status(200).json("Category has been deleted");
});


module.exports = router;