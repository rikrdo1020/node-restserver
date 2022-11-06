const { response } = require("express");
const { Category } = require('../models')

// getCategories - paginado - total - populate
const getCategories = async(req = request, res = response) => {

    const { limit = 5, from = 0 } = req.query;
    const query = { state: true}

    const [ total, categories ] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
            .skip(Number(from))
            .limit(Number(limit))
            .populate("user", 'name')
    ]);

    res.json({
        total,
        categories
    });
}

const getCategory = async(req, res = response) => {
    const { id } = req.params;
    const categoria = await Category.findById ( id ).populate('user', 'name');
    
    res.json( categoria );
}

const createCategoty = async(req, res = response) => {

    const name = req.body.name.toUpperCase();

    const categoryDB = await Category.findOne({ name });

    if ( categoryDB ) {
        return res.status(400).json({
            msg: `The category ${ categoryDB.name } already exist`
        });
    }

    // Generar data a grabar
    const data = {
        name,
        user: req.user._id
    }

    const category = new Category( data );

    //Guardar DB

    await category.save();

    res.status(201).json(category);
    
}

// updateCategory
const updateCategory = async (req, res = response) => {

    const { id } = req.params;
    const { state, user, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    const category = await Category.findByIdAndUpdate( id, data, { new: true } );

    res.json(category);
}

// deleteCategory - state: false
const deleteCategory = async(req, res = response) => {
    const { id } = req.params;

    const categoryDeleted = await Category.findByIdAndUpdate( id, { state: false }, { new: true });

    res.json(categoryDeleted);
}

module.exports = {
    createCategoty,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
}