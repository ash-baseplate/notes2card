"use client"

import { useUser } from '@clerk/nextjs'
import React, { useEffect } from 'react'
import axios from 'axios';
// import { db } from '@/configs/db';
// import { USER_TABLE } from '@/configs/schema';

function Provider({ children }) {

    const { user } = useUser();

    useEffect(() => {
        user && CheckIsNewUser();
    }, [user])


    const CheckIsNewUser = async () => {

/*         const result = await db.select().from(USER_TABLE)
            .where(eq(USER_TABLE.email, user?.primaryemailAddress?.emailAddress))
        console.log(result);

        if (result?.length == 0) {
            const userResp = await db.insert(USER_TABLE).values({
                userName: user?.fullName,
                email: user?.primaryemailAddress?.emailAddress,

            }).returning({ id: USER_TABLE.id });

            console.log(userResp);
        } */

        const resp = await axios.post('/api/create-user', { user: user });
        console.log(resp.data);
    }

    return (
        <div>
            {children}
        </div>
    )
}

export default Provider