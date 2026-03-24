import axios from "../../service/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all Members
export const fetchAllMembers = createAsyncThunk(
  "member/fetchAllMembers",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.get("/member/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.members;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch Customers");
    }
  },
);

// Fetch Member Counter
export const fetchMemberCounter = createAsyncThunk(
  "/member/fetchMemberCounter",
  async ({ role }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.post(
        "/counter",
        { role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return res.data.seq || 0;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch Member counter",
      );
    }
  },
);

// Add new Member
export const addNewMember = createAsyncThunk(
  "/member/addNewMember",
  async ({ newMember }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;

      const res = await axios.post(
        "/member/create",
        { ...newMember },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to Add New Member");
    }
  },
);

// Fetch Member by ID
export const fetchMemberById = createAsyncThunk(
  "member/fetchMemberById",
  async (memberId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.get(`/member/profile/${memberId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data.member[0] || {};
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.response?.data || "Failed to Fetch Member");
    }
  },
);

// Fetch Member by MemberID
export const fetchMemberByMemberId = createAsyncThunk(
  "member/fetchMemberByMemberId",
  async ({ memberId }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.get(`/member/profile/id/${memberId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
      return res.data.member;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to Fetch Member");
    }
  },
);

// Update Member by ID
export const updateMemberById = createAsyncThunk(
  "member/updateMemberById",
  async (
    { member, membership, fitnessPlan },
    { getState, rejectWithValue },
  ) => {
    try {
      const { token } = getState().auth;
      const { _id: memberId } = member;

      const res = await axios.put(
        `/member/update/${memberId}`,
        { member, membership, fitnessPlan },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to Update Member");
    }
  },
);

// Delete member by Id
export const deleteMemberById = createAsyncThunk(
  "member/deleteMemberById",
  async ({ memberId }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.delete(`/member/delete/${memberId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.memberId;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to Delete Member");
    }
  },
);
