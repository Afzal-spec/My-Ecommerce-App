import CategoryModel from "../models/CategoryModel.js"
import slugify from "slugify"
export const createCategoryController = async (req, res) => {
    try {
        const {name} = req.body
        if(!name) {
            return res.status(401).send({message:'Name is required'})
        }
        const existingCategory = await CategoryModel.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                success:true,
                message:'Category ALready Exists'
            })
        }
        const category = await new CategoryModel({name, slug:slugify(name)}).save()
        res.status(201).send({
            success:true,
            message:"New Category Created",
            category
        })
    } catch (error) {
        console.log(error)
        res.send(500).send({
            success:false,
            error,
            message:'Error in Category'
        })   
    }
}


//update category
export const updateCategoryController = async (req,res) => {
    try {
        const {name} = req.body
        const {id} = req.params
        const category = await CategoryModel.findByIdAndUpdate(id, {name, slug:(name)}, {new:true})
        res.status(200).send({
            success:true,
            message:'Category Updated Successfully',
            category
        })
    } catch (error) {
        console.log(error)
        res.success(500).send({
            success:false,
            error,
            message:'Error while updating category'
        })
    }
}

//get all cat
export const categoryController = async (req, res) => {
    try {
        const category = await CategoryModel.find({})
        res.status(200).send({
            success:true,
            message: 'All categories List',
            category,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error while getting all categories',
        })
    }
};

//single category 
export const singleCategoryController = async (req,res) => {
    try {
        const category = await CategoryModel.findOne({slug:req.params.slug})
        res.status(200).send({
            success:true,
            message:'Get single Category Succeessfuly',
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error while getting single category'
        })
    }
}

//delete category
export const deleteCategoryController = async (req,res) => {
    try {
        const {id} = req.params
        await CategoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success:true,
            message:"Category Deleted Successfully",
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error while deleting category',
            error
        })
    }
}