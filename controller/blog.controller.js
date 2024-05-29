import { blogModel } from "../model/blog.model.js";


export const createBlog = async (req, res) => {
  console.log("req.body: ", req.body);

  try {
    const blogData = await blogModel.create(req.body);

    res.status(200).json({ success: true, status: 200, data: blogData });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      error: error.message,
    });
  }
};

export const retireveBlogs = async (req, res) => {
  try {
    const tourData = await blogModel.find();

    res.status(200).json({ success: true, status: 200, data: tourData });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      error: error.message,
    });
  }
};

export const retrievingSingleBlog = async (req, res) => {
  const blogId = req.params.id;
  try {
    const tourData = await blogModel.findById(blogId);

    res.status(200).json({ success: true, status: 200, data: tourData });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      error: error.message,
    });
  }
};
