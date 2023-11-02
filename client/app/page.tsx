'use client'
import Header from "@/src/layout/header";
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import UserContext from '../context/context';
import Main from "@/src/layout/main";
import { io } from "socket.io-client";

export default function Home() {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState<any>();

  // const socket = io();

  useEffect(() => {
    const token = Cookies.get('token');

    if (token) {
      const decodedToken = jwtDecode(token);
      const data = decodedToken; // Thay 'fullname' bằng thuộc tính chứa tên người dùng trong token của bạn

      setUser(data as any);
    }

    const socket = io("http://localhost:3002");
    setSocket(socket);
  }, []);
  return (
    <UserContext.Provider value={user}>
      <Header />
      <Main />
    </UserContext.Provider>
  )
}
