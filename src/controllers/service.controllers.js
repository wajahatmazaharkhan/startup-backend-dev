import { Service } from "../models/service.model.js";
import { asyncHandler } from "../utils/async-handler.js";


export const addService = asyncHandler(async (req, res) => {
    const { title, description, slug } = req.body;

    if (!title || !description || !slug) {
        return res.status(400).json({ msg: "all fields are required" })
    }

    const ExistedTitle = await Service.findOne({title});

    if(ExistedTitle){
        return res.status(400).json({ msg : "title alreay existed"})
    }

    const newService = await Service.create({
        title,
        description,
        slug
    })

    if (!newService) {
        return res.status(402).json({ msg: "service is not created" })
    }

    return res.status(200).json({ msg: "service is created", newService })
})

export const getAllService = asyncHandler( async(req,res) => {

    const allservice = await Service.find();

    if(!allservice){
        return res.status(404).json({ msg : " service not found"})
    }

    return res.status(200).json({ msg : "all service found" , allservice})
})

export const getServiceBySlug = asyncHandler( async(req,res) => {
    
    const {slug} = req.params;

    if(!slug){
        return res.status(404).josn({ msg : "slug not fount"})
    }

    const service = await Service.find({ slug : slug});

    if(!service){
        return res.status(404).json({ msg : "slug not found"})
    }

    return res.status(200).json({ msg : "services found" , service});
})

export const removeService = asyncHandler(async (req, res) => {
  const { title } = req.params;

  if (!title) {
    return res.status(400).json({ msg: "Slug is required" });
  }

  const service = await Service.findOne({ title });

  if (!service) {
    return res.status(404).json({ msg: "Service not found" });
  }

  await Service.deleteOne({ title });

  return res.status(200).json({
    msg: "Service removed successfully",
  });
});

export const updateServiceByTitle = asyncHandler(async (req, res) => {
  const { oldTitle } = req.params;
  const { title, description, category } = req.body;

  const updateData = {};
  if (title) updateData.title = title;
  if (description) updateData.description = description;
  if (category) updateData.category = category;

  const updatedService = await Service.findOneAndUpdate(
    { title: oldTitle },
    updateData,
    { new: true, runValidators: true }
  );

  if (!updatedService) {
    return res.status(404).json({ msg: "Service not found" });
  }

  res.status(200).json({ msg: "Service updated", service: updatedService });
});



