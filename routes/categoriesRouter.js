const express = require('express');
const router = express.Router();
const { Database } = require('../db/databaseQueries');

/**
 * @swagger
 * components:
 *      schemas:
 *          Category_Object:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                      example: 10
 *                  name:
 *                      type: string
 *                      example: Electronics
 *          All_Categories:
 *              type: object
 *              properties:
 *                  msg:
 *                      type: string
 *                      example: All categories
 *                  data:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Category_Object'
 *              xml:
 *                  name: category
 *          Category:
 *              type: object
 *              properties:
 *                  msg:
 *                      type: string
 *                      example: Category selected
 *                  data:
 *                      $ref: '#/components/schemas/Category_Object'
 *              xml:
 *                  name: category
 */
                      
/**
 * @swagger
 * /categories:
 *      get:
 *          tags:
 *              - Category
 *          description: Get all categories
 *          produces:
 *              - application/json
 *          responses:
 *              '200':
 *                  description: All categories are loaded
 *                  content:
 *                      application/json:
 *                        schema:
 *                          $ref: '#/components/schemas/All_Categories'
 *                      application/xml:
 *                        schema:
 *                          $ref: '#/components/schemas/All_Categories'
 *              '400':
 *                  description: No categories found
 */

router.get('/', async (req, res, next) => {
    const categories = await Database.getAllCategories();
    console.log(categories);
    if (categories.length !== 0) {
        return res.status(200).json({ message: 'All categories are loaded', data: categories });
    }

    return res.status(400).json({ error: 'No categories found' });
});

/**
 * @swagger
 * /categories/:categoryId:
 *      get:
 *          tags:
 *              - Category
 *          description: Get category by id
 *          parameters:
 *              - name: categoryId
 *                in: path
 *                description: ID of category to return
 *                required: true
 *          produces:
 *              - application/json
 *          responses:
 *              200:
 *                  description: Category id selected
 *                  content:
 *                      application/json:
 *                        schema:
 *                          $ref: '#/components/schemas/Category'
 *                      application/xml:
 *                        schema:
 *                          $ref: '#/components/schemas/Category'
 *              400:
 *                  description: Category id not found
 */

router.get('/:categoryId', async (req, res, next) => {
    const { categoryId } = req.params;
    const category = await Database.getCategoryById(categoryId);
    if (!category) {
        return res.status(400).json({ error: `Category id not found` });
    }

    return res.status(200).json({ message: `Category selected`, data: category });
});

/**
 * @swagger
 * /categories/add-category:
 *      post:
 *          tags:
 *              - Category
 *          description: Add new category
 *          requestBody:
 *              description: Created category object
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Category_Object'
 *                  application/xml:
 *                      schema:
 *                          $ref: '#/components/schemas/Category_Object'
 *          responses:
 *              201:
 *                  description: Category name successfully created
 *              400:
 *                  description: Category name not provided
 *              401:
 *                  description: Category already exists
 */

router.post('/add-category', async (req, res, next) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Category name not provided' });
    }

    const categories = await Database.getAllCategories();
    const existentCategory = categories.some(category => category.name === name);
    if (existentCategory) {
        return res.status(401).json({ error: 'Category already exists' });
    }

    const addCategory = await Database.addCategory(name);
    return res.status(201).json({ message: `Category successfully created` });
});

/**
 * @swagger
 * /categories/edit-category:
 *      put:
 *          tags:
 *              - Category
 *          description: Edit category
 *          requestBody:
 *              description: Updated category object
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Category_Object'
 *                  application/xml:
 *                      schema:
 *                          $ref: '#/components/schemas/Category_Object'
 *          responses:
 *              200:
 *                  description: Category id has been updated to name
 *              400:
 *                  description: Name not provided for category
 *              401:
 *                  description: Category id does not exist
 */

router.put('/edit-category', async (req, res, next) => {
    const { id, name } = req.body;
    if (!name) {
        return res.status(400).json({ error: `Name not provided for category` });
    }
    
    const categories = await Database.getAllCategories();
    const existentCategory = categories.some(category => category.id === id);
    if(!existentCategory) {
        return res.status(401).json({ error: `Category does not exist` });
    }
    
    const updateCategory = await Database.updateCategory(id, name);
    return res.status(200).json({ message: `Category name has been updated` });
});

/**
 * @swagger
 * /categories/delete-category/:categoryName:
 *      delete:
 *          tags:
 *              - Category
 *          description: Delete category
 *          parameters:
 *              - name: categoryName
 *                in: path
 *                description: name of category to be deleted
 *                required: true
 *          responses:
 *              200:
 *                  description: Category has been deleted
 *              400:
 *                  description: Category does not exist
 */

router.delete('/delete-category/:categoryId', async (req, res, next) => {
    const { categoryId } = req.params;
    const categories = await Database.getAllCategories();

    const existentCategory = await categories.some(category => category.id === Number(categoryId));
    if (!existentCategory) {
        return res.status(400).json({ error: "Category does not exist" });
    }

    const deleteCategory = await Database.deleteCategory(categoryId);
    return res.status(200).json({ message: "Category has been deleted" });
});


module.exports = router;