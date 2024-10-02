"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from 'axios';

import RegisterForm from "@/components/Form/RegisterForm";

const Register = ({ params: { userId } }: SearchParamProps) => {

    const [user, setUser] = useState()
    useEffect(() => {
        axios.get(`http://localhost:3007/api/user?id=${userId}`)
            .then((response) => {
                setUser(response?.data)
            })
            .catch((error) => {
                console.log('Error while Register : ', error)
            })
    }, [userId])

    return (
        <div className="flex h-screen max-h-screen">
            <section className="remove-scrollbar container" >
                <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
                    <Image src="/assets/icons/logo-full.svg" alt="healthcare" height={1000} width={1000} className="mb-12 h-10 w-fit"></Image>
                    <RegisterForm user={user} />
                    <p className="copyright py-12">
                        © 2024 CarePluse.
                    </p>
                </div>
            </section>
            <Image src="/assets/images/register-img.png" alt="healthcare" height={1000} width={1000} className="side-img max-w-[390px]" />
        </div>
    )
}

export default Register;