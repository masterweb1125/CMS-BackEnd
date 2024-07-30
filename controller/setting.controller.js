
import {settingModel} from '../model/setteing.model.js'
export const GetSettings = async(req,res)=>{
    try {
        const {id} = req.params;
        const setting = await settingModel.findById(id)
        if (!setting) {
            return res.status(404).json({msg:"setting not found",status:false});
        }

        res.status(200).json({status:true,data:setting})
    } catch (error) {
        res.status(500).json({status:false,msg:error.message})
    }
}           