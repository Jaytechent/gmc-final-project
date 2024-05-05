// components/Home.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import NightAndDay from '../component/nightday/NightDayToggle'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Input, Card, message, Spin } from 'antd';
import { setPosts } from '../store/postSlice';
import { selectUser } from '../store/userSlice';
import Marquee from 'react-fast-marquee';
import {  useNavigate } from "react-router-dom";
import ConnectMetamask from '../component/ConnectWallet';


const { Meta } = Card;

const Home = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showNext, setShowNext] = useState(true);

  const [comment, setComment] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPrevious, setShowPrevious] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const posts = useSelector((state) => state.posts.posts);
  const allPosts = useSelector((state) => state.posts.allPosts);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`${BASE_URL}/api/v1/auth/home`, {
          params: {
            pageNumber,
          },
        });

        dispatch(setPosts(response.data));

        // Show "Previous" button if we are not on the first page
        setShowPrevious(pageNumber > 0);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        // Ensure loading is set to false after the data is received
        setLoading(false);
      }
    };

    // Fetch data
    fetchData();
  }, [dispatch, pageNumber, BASE_URL]);
  const showCommentModal = (post) => {
    setSelectedPost(post);
    setCommentModalVisible(true);
  };

  const handleLike = async (postId) => {
    try {
      if (!user) {
        // User not logged in, navigate to login page
        // You can replace '/login' with the actual login page route
        return navigate('/login');
      }

      const response = await axios.post(`${BASE_URL}/api/v1/posts/like/${postId}`);
      setLikeCount(response.data.likes);
    } catch (error) {
      console.error("Error liking post:", error);
      message.error("Error liking post");
    }
  };

  const handleComment = async () => {
    try {
      if (!user) {
        // User not logged in, navigate to login page
        // You can replace '/login' with the actual login page route
        return navigate('/login');
      }

      const response = await axios.post(
        `${BASE_URL}/api/v1/posts/comment/${selectedPost._id}`,
        { text: comment, userId: user.userId }
      );

      // Update the posts data in the state
      const updatedPosts = posts.map((post) =>
        post._id === selectedPost._id ? response.data : post
      );
      dispatch(setPosts(updatedPosts));

      // Close the comment modal
      setCommentModalVisible(false);
      setComment(""); // Clear the comment input
    } catch (error) {
      console.error("Error adding comment:", error);
      message.error("Error adding comment");
    }
  };

  const [paginationList, setPaginationList] = useState([]);

  return (



    
    <div className="container mx-auto">
   <div className="flex justify-start">
  <NightAndDay />
</div>

      <div className="absolute top-0 right-0 mr-4 mt-4"> 
        <ConnectMetamask />
      </div>
      

{loading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <Spin size="large" />
        </div>
      )}




      <h1 style={{ wordWrap: "break-word" }}>
      Welcome to the SUBSPACE Forum! Engage in thoughtful discussions and ensure your contributions are relevant and organized within our community. </h1>

      <Marquee>
        <p className="text-transparent bg-gradient-to-tr from-red-900 to-blue-900 bg-clip-text">
        Subspace is the first layer-one blockchain that is resolving the blockchain trilemma.
        </p>
      </Marquee>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts?.map((post) => (
          <Card
            key={post._id}
            hoverable
            style={{ width: "100%", margin: "auto" }}
            className="mb-4 flex h-42 flex-col md:flex-row"
          >
            {post?.pictures.length > 0 ? (
              <div className="md:w-80 md:border-r-2">
                <img
                  className="object-cover h-48 w-full rounded-md"
                  key={post.pictures[0].public_id}
                  src={post.pictures[0].image}
                  alt="Post Image"
                />
              </div>
            ) : (
              <div className="md:w-80 md:border-r-2">
                <img
                  className="object-cover h-48 w-full rounded-md"
                  src="/no-image.jpeg"
                  alt="Placeholder Image"
                />
              </div>
            )}

            <div className="md:flex-1 md:ml-4">
              <Meta
                title={
                  <h4
                    style={{ wordWrap: "break-word" }}
                    className="content font-bold text-2xl h-4"
                  >
                    {post.title.substring(0, 20) +
                      (post.content.length > 20 ? "..." : "")}
                  </h4>
                }
                description={
                  <p className="break-words content-home h-20">
                    {post.content.substring(0, 100) +
                      (post.content.length > 100 ? "..." : "")}
                  </p>
                }
              />

              <div className="mt-4 flex justify-between items-center">
                <Link to={`/post/${post._id}`}>Read more</Link>
                <div>
                  <Button onClick={() => showCommentModal(post)}>
                    Comment
                  </Button>
                  <Button onClick={() => handleLike(post._id)}>Like</Button>
                  <span>{likeCount}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        title="Add Comment"
        open={commentModalVisible}
        onOk={handleComment}
        onCancel={() => setCommentModalVisible(false)}
      >
        <Input
          placeholder="Type your comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </Modal>

      <div
        className="fixed bottom-0 left-1/2 transform -translate-x-1/2 flex gap-3 items-center justify-center p-3 w-full bg-red-50 rounded-md shadow-md hover:scale-105"
        style={{ maxWidth: "600px" }}
      >
        {showPrevious && (
          <Button onClick={() => setPageNumber(pageNumber - 1)}>Previous</Button>
        )}

<Button onClick={() => setPageNumber(pageNumber + 1)} disabled={!showNext}>
  Next
</Button>

      </div>
    </div>
  );
};

export default Home;
