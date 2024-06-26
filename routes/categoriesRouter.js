const express = require('express');
const router = express.Router();
const { Database } = require('../db/databaseQueries');

const checkCategoryIsValid = async (req, res, next) => {
    const { categoryId } = req.params;
    const category = await Database.getItemById("categories", categoryId);
    if (!category) {
        return res.status(400).json({ error: `Category was not found` });
    } else {
        req.categoryData = category;
        next();
    }
};

/**
 * @swagger
 * components:
 *      schemas:
 *          Category_Object:
 *              type: object
 *              properties:
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
 */

router.get('/', async (req, res, next) => {
    const categories = await Database.getAllItems("categories");
    
    return res.status(200).json({ message: 'All categories are loaded', data: categories });
    
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
 *                  description: Category data was loaded
 *                  content:
 *                      application/json:
 *                        schema:
 *                          $ref: '#/components/schemas/Category'
 *                      application/xml:
 *                        schema:
 *                          $ref: '#/components/schemas/Category'
 *              400:
 *                  description: Category was not found
 */

router.get('/:categoryId', checkCategoryIsValid, async (req, res, next) => {
    return res.status(200).json({ message: `Category data was loaded`, data: req.categoryData });
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

    const categories = await Database.getAllItems("categories");
    const existentCategory = categories.some(category => category.name === name);
    if (existentCategory) {
        return res.status(401).json({ error: 'Category already exists' });
    }

    const addCategory = await Database.addCategory(name);
    return res.status(201).json({ message: `Category successfully created` });
});

/**
 * @swagger
 * /categories/edit-category/:categoryId:
 *      put:
 *          tags:
 *              - Category
 *          description: Edit category
 *          parameters:
 *              - name: categoryId
 *                in: path
 *                description: id of category to be deleted
 *                required: true
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
 *              401:
 *                  description: Name not provided for category
 *              400:
 *                  description: Category was not found
 */

router.put('/edit-category/:categoryId', checkCategoryIsValid, async (req, res, next) => {
    const { name } = req.body;
    if (!name) {
        return res.status(401).json({ error: `Name not provided for category` });
    }
    
    const updateCategory = await Database.updateCategory(req.categoryData.id, name);
    return res.status(200).json({ message: `Category name has been updated` });
});

/**
 * @swagger
 * /categories/delete-category/:categoryId:
 *      delete:
 *          tags:
 *              - Category
 *          description: Delete category
 *          parameters:
 *              - name: categoryId
 *                in: path
 *                description: id of category to be deleted
 *                required: true
 *          responses:
 *              200:
 *                  description: Category has been deleted
 *              400:
 *                  description: Category was not found
 */

router.delete('/delete-category/:categoryId', checkCategoryIsValid, async (req, res, next) => {
    const deleteCategory = await Database.deleteCategory(req.categoryData.id);
    return res.status(200).json({ message: "Category has been deleted" });
});


module.exports = router;