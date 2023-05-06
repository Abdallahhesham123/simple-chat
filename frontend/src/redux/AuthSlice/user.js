
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import * as api from "../Apis.js";
const initialState = {
  mode: "light",
  user: null,
  error: "",
  loading: false,
}

export const login = createAsyncThunk(
  "auth/login",
  async ({ user, navigate, toast }, { rejectWithValue }) => {
    try {
      const response = await api.signIn(user);
      toast.success("Login Successfully");
      navigate("/chat");
      return response.data;
    } catch (err) {

      return rejectWithValue(err.response.data.message);
    }
  }
);
export const googleSignIn = createAsyncThunk(
  "auth/googleSignIn",
  async ({ googleAccessToken, navigate, toast }, { rejectWithValue }) => {
    try {
    
      const response = await api.googleSignIn(googleAccessToken);
      navigate("/chat");
      toast.success("Login Successfully");
      
      console.log("loginresponse",response)
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


export const facebookSignIn = createAsyncThunk(
  "auth/facebookSignIn",
  async ({ res, navigate, toast }, { rejectWithValue }) => {
    try {
    console.log(res);
      const response = await api.facebookSignIn(res);
      toast.success("Login Successfully");
      navigate("/chat");
      console.log("loginresponse",response)
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const GithubSignIn = createAsyncThunk(
  "auth/GithubSignIn",
  async ({ res, navigate, toast }, { rejectWithValue }) => {
    try {
    console.log(res);
      const response = await api.GithubSignIn(res);
      toast.success("Login Successfully");
      navigate("/chat");
      console.log("loginresponse",response)
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      setMode: (state) => {
        state.mode = state.mode === "light" ? "dark" : "light";
      },
      setUser: (state, action) => {
        state.user = action.payload;
  
      },
      setLogout: (state) => {
        localStorage.removeItem("token");
        state.user = null;
       state.error="";
        state.loading= false;
        
      }
    },
    extraReducers: {
      [login.pending]: (state, action) => {
        state.loading = true;
      },
      [login.fulfilled]: (state, action) => {
        state.loading = false;
        localStorage.setItem("token", action.payload.token);
        state.user = action.payload.result;
        state.error = "";
      },
      [login.rejected]: (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload
    
      },

      [googleSignIn.pending]: (state, action) => {
        state.loading = true;
      },
      [googleSignIn.fulfilled]: (state, action) => {
        state.loading = false;
        localStorage.setItem("token", action.payload.token);

        state.user = action.payload.result;
        state.error="";
      },
      [googleSignIn.rejected]: (state, action) => {
        state.loading = false;
        state.user = null;
        console.log(action);
        state.error = action.payload?.message
      },

      [facebookSignIn.pending]: (state, action) => {
        state.loading = true;
      },
      [facebookSignIn.fulfilled]: (state, action) => {
        state.loading = false;
        localStorage.setItem("token", action.payload.token);
        state.user = action.payload.result;
        state.error="";
      },
      [facebookSignIn.rejected]: (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload?.message
      },


      [GithubSignIn.pending]: (state, action) => {
        state.loading = true;
      },
      [GithubSignIn.fulfilled]: (state, action) => {
        state.loading = false;
        localStorage.setItem("token", action.payload.token);
        state.user = action.payload.result;
        state.error="";
      },
      [GithubSignIn.rejected]: (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload?.message
      },

    }


  })
  
  // Action creators are generated for each case reducer function
  export const {setMode ,setUser, setLogout  } = authSlice.actions
  
  export default authSlice.reducer