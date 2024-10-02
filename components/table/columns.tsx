"use client"

import React from 'react';
import Image from 'next/image';
import { ColumnDef } from "@tanstack/react-table"
import StatusBadge from '../StatusBadge';
import { formatDateTime } from '@/lib/utils';
import { Doctors } from '@/constant';
import AppointmentModal from '../AppointmentModal';
import { Appointment } from '@/types/appwrite.types';

export const columns: ColumnDef<Appointment>[] = [
    {
        header: 'ID',
        cell: ({ row }) => {
            return (
                <p className="text-14-medium">{row?.index + 1}</p>
            )
        }
    },
    {
        accessorKey: 'patient',
        header: 'Patient',
        cell: ({ row }) => {
            const appointment = row?.original?.userId[0]
            return (
                <p className="text-14-regular">{appointment?.name}</p>
            )
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row?.original?.status
            return (
                <div className="min-w-[115px]">
                    <StatusBadge status={status} />
                </div>
            )
        },
    },
    {
        accessorKey: "schedule",
        header: "Appointment",
        cell: ({ row }) => {
            return (<p className="min-w-[115px] text-14-regular">
                {formatDateTime(row?.original?.schedule).dateTime}
            </p>)
        }
    },
    {
        accessorKey: "primaryPhisican",
        header: () => 'Doctor',
        cell: ({ row }) => {
            const doctor = Doctors.find((ele) => row?.original?.userId[0]?.primaryPhisican === ele.name)
            return (
                <div className="flex items-center gap-3">
                    <Image src={doctor?.image || ''} height={100} width={100} className="size-8" alt={doctor?.name || 'doctor'} />
                    <p className="whitespace-nowrap">{doctor?.name}</p>
                </div>
            )
        },
    },
    {
        id: 'actions',
        header: () => <div className="pl-4">Actions</div>,
        cell: ({ row }) => {
            const userId = row.original.userId[0]._id
            const patientId = row.original._id
            return (
                <div className="flex gap-1">
                    <AppointmentModal
                        type="schedule"
                        userId={userId}
                        patientId={patientId}
                        appointmentId={row.original}
                        title='Schedule Appointment'
                        description="Please confirm the following details to scheduled an appointment."
                    />
                    <AppointmentModal
                        type="cancel"
                        userId={userId}
                        patientId={patientId}
                        appointmentId={row.original}
                        title='Cancel Appointment'
                        description="Are you sure you want to cancel this appointment?"
                    />
                </div>
            )
        }
    }
]