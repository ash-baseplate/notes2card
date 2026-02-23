'use client';

import { useUser } from '@clerk/nextjs';
import React, { useEffect } from 'react';
import axios from 'axios';
// import { db } from '@/configs/db';
// import { USER_TABLE } from '@/configs/schema';

function Provider({ children }) {
  const { user } = useUser();

  useEffect(() => {
    user && CheckIsNewUser();
  }, [user]);

  const CheckIsNewUser = async () => {
    const resp = await axios.post('/api/create-user', { user: user });
    console.log(resp.data);
  };

  return <div>{children}</div>;
}

export default Provider;
