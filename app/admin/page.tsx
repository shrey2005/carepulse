"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import StatCard from '@/components/StatCard';
import { columns } from '@/components/table/columns'
import { DataTable } from '@/components/table/DataTable';

const Admin = () => {

    const [appointments, setAppointments] = useState()

    useEffect(() => {
        axios.get('http://localhost:3007/api/recentAppointment')
            .then((response) => {
                setAppointments(response?.data?.data)
            })
            .catch((error) => {
                console.log('Error : ', error)
            })
    }, [])

    return (
        <div className="mx-auto flex flex-col max-w-7xl space-y-14">
            <header className="admin-header">
                <Link href="/" className="cursor-pointer">
                    <Image src="/assets/icons/logo-full.svg" width={162} height={32} alt="logo" className="h-8 w-fit" />
                </Link>

                <p className="text-16-semibold">Admin Dashboard</p>
            </header>
            <main className="admin-main">
                <section className="w-full space-y-4">
                    <h1 className="header">Welcome</h1>
                    <p className="text-dark-700">Start the day with managing new opportunities</p>
                </section>

                <section className="admin-stat">
                    <StatCard
                        type="appointments"
                        count={appointments?.scheduledCount}
                        label="Scheduled appointments"
                        icons="/assets/icons/appointments.svg"
                    />
                    <StatCard
                        type="pending"
                        count={appointments?.pendingCount}
                        label="Pending appointments"
                        icons="/assets/icons/pending.svg"
                    />
                    <StatCard
                        type="cancelled"
                        count={appointments?.cancelledCount}
                        label="cancelled appointments"
                        icons="/assets/icons/cancelled.svg"
                    />
                </section>
                {appointments && <DataTable columns={columns} data={appointments?.appointments} />}
            </main>
        </div>
    )
}

export default Admin;