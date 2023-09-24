'use client'
import Header from "@/src/layout/header";
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import UserContext from '../context/context';
import Main from "@/src/layout/main";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = Cookies.get('token');

    if (token) {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken)
      const { fullname }: any = decodedToken; // Thay 'fullname' bằng thuộc tính chứa tên người dùng trong token của bạn

      setUser(fullname);
    }
  }, []);
  return (
    <UserContext.Provider value={user}>
      <Header />
      <Main />
    </UserContext.Provider>
  )
}
