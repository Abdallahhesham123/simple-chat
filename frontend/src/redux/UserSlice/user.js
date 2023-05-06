
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import * as api from "../Apis.js";
const initialState = {
 
  contactsUsers: [],
  error: "",
  loading: false,
}

export const getAllUser = createAsyncThunk(
  "contact/getAllUser",
  async (_, { rejectWithValue }) => {
    try {
      const {data} = await api.getAlluser();
console.log("res",data);
      return data;
    } catch (err) {

      return rejectWithValue(err.response.data.message);
    }
  }
);


export const contactSlice = createSlice({
    name: 'contact',
    initialState,

    extraReducers: {
      [getAllUser.pending]: (state, action) => {
        state.loading = true;
      },
      [getAllUser.fulfilled]: (state, action) => {
        state.loading = false;
        
        console.log(action.payload);
       
        state.contactsUsers = action.payload.users;
        state.error = "";
      },
      [getAllUser.rejected]: (state, action) => {
        state.loading = false;
        state.user = [];
        state.error = action.payload
    
      },

    }


  })
  
  // Action creators are generated for each case reducer function
  // export const {setMode ,setUser, setLogout  } = contactSlice.actions
  
  export default contactSlice.reducer