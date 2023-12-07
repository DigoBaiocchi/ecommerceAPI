const express = require('express');
const router = express.Router();
const { Database } = require('../db/databaseQueries');

// mock database
const categories = [{id: 1, name: 'Pork'}];

router.get('/', async (req, res, next) => {
    const categories = await Database.getAllCategories();
    console.log(categories)
    if (categories.length !== 0) {
        return res.status(200).json({msg: 'All categories are loaded', data: categories});
    }
    return res.status(400).json({msg: 'No categories found'});
});

router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    const category = await Database.getCategoryById(id);
    if (!category) {
        return res.status(400).json({msg: `Category ${id} not found`});
    }
    return res.status(200).json({msg: `Category ${id} selected`, data: category});
});

router.post('/add-category', async (req, res, next) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({msg: 'Category name not provided'});
    }
    const categories = await Database.getAllCategories();
    const existentCategory = categories.some(category => category.name === name);
    if (existentCategory) {
        return res.status(400).json({msg: 'Category already exists'});
    }
    const addCategory = await Database.addCategory(name);
    return res.status(201).json({msg: `Category ${name} successfully created`});
});

router.put('/edit-category', async (req, res, next) => {
    const { id, name } = req.body;
    if (!name) {
        return res.status(400).json({msg: `Name not provided for category ${id}`});
    }
    
    const categories = await Database.getAllCategories();
    const existentCategory = categories.some(category => category.id === id);
    if(!existentCategory) {
        return res.status(400).json({msg: `Category ${id} does not exist`});
    }

    const updateCategory = await Database.updateCategory(id, name);
    return res.status(200).json({msg: `Category ${id} has been updated to ${name}`});
});

router.delete('/delete-category/:name', async (req, res, next) => {
    const { name } = req.params;
    const categories = await Database.getAllCategories();
    const existentCategory = categories.some(category => category.name === name);
    if (!existentCategory) {
        return res.status(400).json({msg: "Category does not exist"});
    }
    const deleteCategory = await Database.deleteCategory(name);
    return res.status(200).json({msg: "Category has been deleted"});
});


module.exports = router;