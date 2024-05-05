// postsSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
  allPosts: null
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
      state.allPosts = action.payload.allPosts;
    },
  },
});

export const { setPosts } = postsSlice.actions;
export const selectPosts = (state) => state.posts.posts;
export const selectAllPosts = (state) => state.posts.allPosts;

export default postsSlice.reducer;
