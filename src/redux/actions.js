import storageUtils from '../utils/storageUtils';

import axios from 'axios';
import {
  SET_HEAD_TITLE,
  RECEIVE_USER,
  SHOW_ERROR_MSG,
  RESET_USER,
  RECEIVE_ALL_USER,
} from './constant'

export const receiveUser = (userData) => ({ type: RECEIVE_USER, userData });

export const receiveAllUser = (allUserData) => ({type:RECEIVE_ALL_USER, allUserData})

export const showErrorMsg = (errorMsg) => ({ type: SHOW_ERROR_MSG, errorMsg });


/* 退出登陆的同步action */

export const logout = () => {
  storageUtils.deleteUser();
  return { type: RESET_USER };
};



/*  
登陆的异步 action
*/
export const login = (username, password) => async (dispatch) => {
  //执行异步请求
  axios.post(
    '/our/login',
    {
      username: username,
      password: password,
    }
  )
  .then(
    (res) =>{
      console.log(res)
      const userData = res.data
      storageUtils.saveUser(userData);
      dispatch(receiveUser(userData));
    },
    (err)=>{
      dispatch(showErrorMsg(err));
      alert("用户名或密码错误!")
    }
  )
  .catch(
    (err)=>{
      console.log(err)
    }
  )
};

/**
 * 获取所有用户 action
 */
export const getAllUser = () => (dispatch) =>{
  axios.get(
    '/our/admin/user'
  )
  .then(
    (res)=>{
      console.log('GETALLUSER',res)
      const allUserData = res.data
      dispatch(receiveAllUser(allUserData))
    }
  )
  .catch(
    (err)=>{
      console.log(err)
    }
  )
}