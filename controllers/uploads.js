
const path = require('path')
const fs = require('fs')

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL)

const { response } = require("express");
const { uploadFile } = require('../helpers');

const { User, Product } = require('../models');


const loadFile = async(req, res = response) =>{

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        res.status(400).json({ msg:'No files in the request.'});
        return;
    }

    try {
        const name = await uploadFile( req.files, ['txt', 'md'])
        res.json({ name })
    } catch (msg) {
        res.status(400).json({msg})
    }
}

const updateImage = async(req, res = response) =>{

    const {id, collection} =req.params;

    let model;

    switch ( collection ) {
        case 'users':
            model = await User.findById( id );
            if(!model) {
                return res.status(400).json({
                    msg:`The user ${id} does not exist`
                });
            }
        break;

        case 'products':
            model = await Product.findById( id );
            if(!model) {
                return res.status(400).json({
                    msg:`The product ${id} does not exist`
                });
            }
        break;
    
        default:
            return res.status(500).json({ msg: 'This is not validated'});
    }

    //Clean previous images

    if( model.img ){
        const pathImg = path.join( __dirname , '../uploads', collection, model.img);
        if( fs.existsSync ( pathImg )){
            fs.unlinkSync( pathImg )
        }
    }
    const name = await uploadFile( req.files, undefined, collection )
    model.img = name;

    await model.save()
    
    res.json( model )

}

const updateImageCloudinary = async(req, res = response) =>{

    const {id, collection} =req.params;

    let model;

    switch ( collection ) {
        case 'users':
            model = await User.findById( id );
            if(!model) {
                return res.status(400).json({
                    msg:`The user ${id} does not exist`
                });
            }
        break;

        case 'products':
            model = await Product.findById( id );
            if(!model) {
                return res.status(400).json({
                    msg:`The product ${id} does not exist`
                });
            }
        break;
    
        default:
            return res.status(500).json({ msg: 'This is not validated'});
    }

    //Clean previous images

    if( model.img ){
        //
        const nameArr = model.img.split('/');
        const name = nameArr[ nameArr.length - 1];
        const [ public_id ] = name.split('.');
        cloudinary.uploader.destroy( public_id );
    }

    const { tempFilePath } = req.files.file;

    const {secure_url} = await cloudinary.uploader.upload( tempFilePath )
    model.img = secure_url;

    await model.save()
    
    res.json( model )

}

const showImage = async(req, res = response) => {

    const {id, collection} =req.params;

    let model;

    switch ( collection ) {
        case 'users':
            model = await User.findById( id );
            if(!model) {
                return res.status(400).json({
                    msg:`The user ${id} does not exist`
                });
            }
        break;

        case 'products':
            model = await Product.findById( id );
            if(!model) {
                return res.status(400).json({
                    msg:`The product ${id} does not exist`
                });
            }
        break;
    
        default:
            return res.status(500).json({ msg: 'This is not validated'});
    }

    //Clean previous images

    if( model.img ){
        const pathImg = path.join( __dirname , '../uploads', collection, model.img);
        if( fs.existsSync ( pathImg )){
            return res.sendFile( pathImg )
        }
    }

    res.sendFile( path.join (__dirname, '../assets/no-image.jpg'))
}

module.exports = {
    loadFile,
    showImage,
    updateImage,
    updateImageCloudinary
}