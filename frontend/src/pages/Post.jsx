import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, Link, useNavigate, useParams } from 'react-router-dom';
import { selectPosts } from '../store/postSlice';
import { Button, Card, Modal, Input, Dropdown, Menu, Popconfirm } from 'antd';
import axios from 'axios';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { Meta } = Card;

export default function Post() {
  const { postId } = useParams();
  const posts = useSelector(selectPosts);
  const { user } = useSelector((state) => state.user);
  const post = posts.find((post) => post._id.toString() === postId);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [editContent, setEditContent] = useState(post.content); // Track edited content
  const [editModalVisible, setEditModalVisible] = useState(false);

  const deletePost = async () => {
    try {
      const res = await axios.delete(`${BASE_URL}/api/v1/posts/delete/${postId}`);
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  const updatePost = async () => {
    try {
      const res = await axios.put(`${BASE_URL}/api/v1/posts/update/${postId}`, {
        content: editContent, // Include the edited content in the request body
      });
    
      // const updatedPostId = res.data.updatedPost._id
      ; // Assuming your response structure contains the updated post ID

      navigate('/'); // Update the path to match your route structure
  
      console.log(res);
      // window.alert('Post updated successfully');
    } catch (error) {
      console.log(error);
    }
  };

  const item = (
    <Menu>
      <Menu.Item key="edit" onClick={() => setEditModalVisible(true)}>
        <EditOutlined /> Edit Post
      </Menu.Item>
      <Menu.Item key="delete">
        <Popconfirm
          title="Are you sure you want to delete this post?"
          onConfirm={deletePost}
          okText="Yes"
          cancelText="No"
        >
          <DeleteOutlined /> Delete Post
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Card
        hoverable
        style={{
          width: '100%',
          margin: '20px auto',
        }}
      >
        <div className='flex justify-between  '>

        <button className='bg-blue-300 border-blue-300 mt-4'><Link  to="/"> ◀</Link></button>

{user && post?.authorId === user?.userId && (
          <Dropdown overlay={item} trigger={['click']} placement="bottomRight">
            <Button className=' bg-blue-300    text' style={{ marginTop: '10px' }}>
            ▼
            </Button>
          </Dropdown>
        )}


        </div>



        <div>
          <p className='content text-2xl text-sky-200'>{`Post By: ${post.author}`}</p>
          <div>
            <h1 className="content-home text-2xl">{post.title}</h1>
            <p
              className="content text-2xl"
              style={{ whiteSpace: 'pre-line', wordWrap: 'break-word' }}
            >
              {post.content.split('\n').map((paragraph, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <br />}
                  {paragraph}
                </React.Fragment>
              ))}
            </p>
          </div>
        </div>

        {post?.pictures.map((item) => (
          <img className="object-cover w-60" key={item.public_id} src={item.image} alt={item.image} />
        ))}


      </Card>


    {/* Edit Modal */}
    <Modal
      title="Edit Post"
      open={editModalVisible}
      onOk={() => {
        updatePost();
        setEditModalVisible(false);
      }}
      onCancel={() => setEditModalVisible(false)}
    >
      <Input.TextArea
        rows={4}
        value={editContent}
        onChange={(e) => setEditContent(e.target.value)}
      />
    </Modal>
    </>
  );
}
