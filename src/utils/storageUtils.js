/*
进行local数据存储的模块
*/


import store from 'store'

//USER_kEY是这个应用的用户的数据在浏览器存储中的标识s
const USER_KEY = 'good_flavor'
 //eslint-disable-next-line
export default{
    /*
    保存user
    */
   saveUser(userData){
    //    localStorage.setItem(USER_KEY,JSON.stringify(user))
    store.set(USER_KEY,userData)
},
   /*
   读取user
   */
    getUser(){
    //   return JSON.parse(localStorage.getItem(USER_KEY)||'{}')
  return store.get(USER_KEY)||{}
},
  /*
  删除user
  */
 deleteUser(){
    //  localStorage.removeItem(USER_KEY)
    store.remove(USER_KEY)
 }
}

