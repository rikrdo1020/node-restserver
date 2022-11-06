const { response } = require("express")
const { ObjectId } = require("mongoose").Types

const {  User, Category, Product} = require('../models')
const allowedCollections = [
    'users',
    'categories',
    'products',
    'roles'
];

const searchUsers = async(term = '', res = response) => {

    const isMongoID = ObjectId.isValid( term );

    if (isMongoID){
        const user = await User.findById( term );
        return res.json({
            results: ( user ) ? [ user ] : []
        })
    }

    const regex = new RegExp( term, 'i');

    const users = await User.find( { 
        $or: [{ name: regex }, { email: regex}],
        $and: [{ state: true }]
    });

    res.json({
        results: users
    })
}

const searchCategories = async( term = '', res = response) =>{
    const isMongoID = ObjectId.isValid( term );

    if (isMongoID){
        const category = await Category.findById( term );
        return res.json({
            results: ( category ) ? [ category ] : []
        })
    }

    const regex = new RegExp( term, 'i');

    const category = await Category.find( {name: regex, state: true});

    res.json({
        results: category
    })
}

const searchProducts = async( term = '', res = response) =>{
    const isMongoID = ObjectId.isValid( term );

    if (isMongoID){
        const products = await Product.findById( term )
                                    .populate('user', 'name')
                                    .populate('category', 'name');
        return res.json({
            results: ( products ) ? [ products ] : []
        })
    }
    const regex = new RegExp( term, 'i');

    const products = await Product.find( {name: regex, state: true})
                                    .populate('user', 'name')
                                    .populate('category', 'name');

    res.json({
        results: products
    })
}

const search = (req, res = response) => {

    const { collection, term } = req.params;

    if(!allowedCollections.includes( collection )){
        return res.status(400).json({
            msg: `The allowed collections are: ${ allowedCollections }`
        })
    }
    
    switch (collection) {
        case 'users':
            searchUsers(term, res)
        break;
        case 'categories':
            searchCategories(term, res)
        break;
        case 'products':
            searchProducts(term, res)
        break;
        default:
            res.status(500).json({
                msg:'This search is not available. Contact the backend:D'
            })
    }

        
}   

module.exports = {
    search
}