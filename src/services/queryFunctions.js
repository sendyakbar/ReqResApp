import axios from 'axios';

import {GET_ALL_USERS, LOGIN, REGISTER} from './endpoints';

export const register = async ({email, password}) => {
  try {
    const {data} = await axios.post(REGISTER, {
      email,
      password,
    });
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const login = async ({email, password}) => {
  try {
    const {data} = await axios.post(LOGIN, {
      email,
      password,
    });
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getAllUsers = async ({pageParam = 1}) => {
  try {
    const {data} = await axios.get(GET_ALL_USERS, {
      params: {
        page: pageParam,
      },
    });
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const createUser = async payload => {
  try {
    const {data} = await axios.post(GET_ALL_USERS, {
      data: payload,
    });
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const editUser = async payload => {
  try {
    const {data} = await axios.put(`${GET_ALL_USERS}/${payload.id}`, {
      data: payload,
    });
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const deleteUser = async ({id}) => {
  try {
    const {data} = await axios.delete(`${GET_ALL_USERS}/${id}`);
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};
