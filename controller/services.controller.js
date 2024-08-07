import { ServicesCaregoryModel } from "../model/servicesCategory.model.js";

export const CreateServicesCategory = async (req, res) => {
  try {
    let { name, description, isActive } = req.body;
    name = name.toUpperCase();
    const existingCategory = await ServicesCaregoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(200).json({
        msg: "Category name must be unique",
        status: true,
        frontenderror: true,
      });
    }
    const ServicesCaregory = await ServicesCaregoryModel.create({
      name,
      description,
      isActive,
    });
    
    res.status(201).json({
      msg: "Category created successfully",
      status: true,
      data: ServicesCaregory,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message, status: false, frontenderror: true });
  }
};


export const GetAllServicesCategory = async (req,res)=>{
    try {
        const category = await ServicesCaregoryModel.find();
        if(!category){
            return res.status(200).json({msg:"category not found",status:false,frontenderror:true})
        }
        res.status(200).json({data:category,status:true,frontenderror:false});
    } catch (error) {
        res.status(500).json({msg:error.message,status:false,frontenderror:false})
    }
}

export const GetServicesCategoryWithName = async ()=>{
    try {
        const {name} = req.params;
        const categoryByName = await ServicesCaregoryModel.findOne({name});
        if (!categoryByName){
            return res.status(200).json({msg:"catagory not found",status:true,frontenderror:true})
        }
        res.status(200).json({data:categoryByName,status:true,frontenderror:false})
    } catch (error) {
        res.status(500).json({msg:error.message,status:false,frontenderror:false})
    }
}

export const UpdateServicesCategory = async (req,res)=>{
  try {
    req.body.name = req.body.name.toUpperCase();
    const updated = await ServicesCaregoryModel.findByIdAndUpdate(req.params.id,{...req.body})
    res.status(200).json({data:updated,msg:"category success fuly updated",status:true});
  } catch (error) {
    res.status(500).json({msg:error.message,status:false})
  }
}