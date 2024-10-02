"use client"

import AppointmentForm from '@/components/Form/AppointmentForm';
import Image from 'next/image';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const NewAppointment = ({ params: { userId } }: SearchParamProps) => {

    const [patient, setPatient] = useState()

    useEffect(() => {
        axios.get(`http://localhost:3007/api/user?id=${userId}`)
            .then((response) => {
                setPatient(response?.data)
            })
            .catch((error) => {
                console.log('Error while new appointment : ', error)
            })
    }, [userId])

    return (
        <div className="flex h-screen max-h-screen">
            <section className="remove-scrollbar container my-auto">
                <div className="sub-container max-w-[860px] flex-1 justify-between">
                    <Image src="/assets/icons/logo-full.svg" alt="healthcare" height={1000} width={1000} className="mb-12 h-10 w-fit" />
                    <AppointmentForm type="create" userId={userId} patientId={patient?.id} />
                    <p className="justify-items-end text-dark-600 xl:text-left">
                        © 2024 CarePluse.
                    </p>
                </div>
            </section>
            <Image src="/assets/images/appointment-img.png" alt="appointment" height={1000} width={1000} className="side-img max-w-[390px] bg-bottom" />
        </div>
    )
}

export default NewAppointment;