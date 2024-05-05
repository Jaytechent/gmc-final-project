import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Form, Input, Select, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const CreatePost = () => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [pictures, setPictures] = useState([]);
  const [previewPictures, setPreviewPictures] = useState([]);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const  BASE_URL =   import.meta.env.VITE_BASE_URL

  useEffect(() => {
    // Fetch categories for the dropdown from the backend API
    axios
      .get(`${BASE_URL}/api/v1/categories`)
      .then((response) => {
        setCategories(response.data);
        console.log("Fetched categories:", response.data);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const handlePictureChange = ({ fileList }) => {
    // Limit to a maximum of 4 pictures
    if (fileList.length > 4) {
      message.error("You can upload a maximum of 4 pictures.");
      return false;
    }
  
    setPictures(fileList);
  
    // Preview pictures
    const previews = fileList.map((file) => URL.createObjectURL(file.originFileObj));
    setPreviewPictures(previews);
  
    return fileList;
  };
  
  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("title", form.getFieldValue("title"));
      formData.append("content", form.getFieldValue("content"));
      formData.append("author", user.name);
      formData.append("authorId", user.userId);
      formData.append("category", form.getFieldValue("category"));

      pictures.forEach((picture) => {
        formData.append("pictures", picture.originFileObj); // Use originFileObj to get the actual File object
      });

      await axios.post(`${BASE_URL}/api/v1/posts`, formData);

      navigate("/");

      // window.alert("Post Created Successfully");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a New Blog Post</h1>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item label="Title" name="title" rules={[{ required: true, message: "Please enter a title" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Content" name="content" rules={[{ required: true, message: "Please enter content" }]}>
          <Input.TextArea />
        </Form.Item>

        <Form.Item label="Category" name="category" rules={[{ required: true, message: "Please select a category" }]}>
          <Select placeholder="Select a category">
            {categories.map((category) => (
              <Option key={category._id} value={category._id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Pictures"
          name="pictures"
          valuePropName="fileList"
          getValueFromEvent={handlePictureChange}
          rules={[
            {
              validator: (_, value) => {
                if (!value || value.length <= 4) {
                  return Promise.resolve();
                }
                return Promise.reject("You can upload a maximum of 4 pictures.");
              },
            },
          ]}
        >
          <Upload
            beforeUpload={() => false}
            listType="picture-card"
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Create Post
          </Button>
        </Form.Item>
      </Form>

      {previewPictures.map((preview, index) => (
        <img key={index} src={preview} alt={`Preview ${index}`} width="100" />
      ))}
    </div>
  );
};

export default CreatePost;
