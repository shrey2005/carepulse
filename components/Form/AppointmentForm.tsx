"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { set, z } from 'zod'
import { getAppointmentSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Appointment } from '@/types/appwrite.types';
import SubmitButton from '../SubmitButton';
import CustomField from '../CustomField';
import { FormFieldType } from './PatientForm';
import { Doctors } from '@/constant';
import { SelectItem } from '../ui/select';
import axios from 'axios';

const AppointmentForm = ({ type, userId, patientId, appointment, setOpen }: ({ type: "create" | "cancel" | "schedule", userId: string, patientId: string, appointment?: Appointment, setOpen: (open: boolean) => void })) => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const AppointmentFormValidation = getAppointmentSchema(type);

    const form = useForm<z.infer<typeof AppointmentFormValidation>>({
        resolver: zodResolver(AppointmentFormValidation),
        defaultValues: {
            primaryPhysician: appointment ? appointment?.userId[0]?.primaryPhisican : '',
            schedule: appointment ? new Date(appointment?.schedule) : new Date(Date.now()),
            reason: appointment?.reason || "",
            note: appointment?.note || "",
            cancellationReason: appointment?.cancellationReason || "",
        }
    })

    let buttonLabel;
    switch (type) {
        case "create":
            buttonLabel = "Create Appointment";
            break;
        case "cancel":
            buttonLabel = "Cancel Appointment";
            break;
        case "schedule":
            buttonLabel = "Schedule Appointment";
            break;
        default:
            break;
    }

    const onSubmit = async (values: z.infer<typeof AppointmentFormValidation>) => {
        setIsLoading(true);

        let status
        switch (type) {
            case 'schedule':
                status = 'Scheduled'
                break;
            case 'cancel':
                status = 'Cancelled'
                break;
            default:
                status = 'Pending'
                break;
        }

        try {
            if (type === 'create' && patientId) {
                const appointmentData = {
                    userId,
                    patient: patientId,
                    primaryPhysician: values.primaryPhysician,
                    schedule: new Date(values.schedule),
                    reason: values.reason,
                    status: status,
                    note: values.note
                }
                axios.post('http://localhost:3007/api/appointment', appointmentData)
                    .then((response) => {
                        if (response) {
                            form.reset();
                            router.push(`/paitents/${userId}/new-appointment/success?appointmentId=${response?.data?.id}`)
                        }
                        console.log('response : ', response)
                    })
                    .catch((error) => {
                        console.log('Error while Appointment form : ', error)
                    })
            }
            else {
                const appointmentToUpdate = {
                    userId,
                    appointmentId: appointment?._id,
                    appointment: {
                        primaryPhysician: values?.primaryPhysician,
                        schedule: new Date(values?.schedule),
                        status: status as Status,
                        cancellationReason: values?.cancellationReason,
                    }
                }

                axios.put('http://localhost:3007/api/appointment', appointmentToUpdate)
                    .then((response) => {
                        if (response) {
                            if (typeof setOpen === 'function') {
                                form.reset();
                                setOpen(false);
                            }
                            window.location.reload();
                        }
                    })
                    .catch((error) => {
                        console.log('Error while updating form : ', error)
                    })
            }
        } catch (error) {
            console.log('Error while Appointment form : ', error)
        }
        setIsLoading(false);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
                {type === 'create' &&
                    <section className="mb-12 space-y-4">
                        <h1 className="header">New Appointment</h1>
                        <p className="text-dark-700">Request a new appointment in 10 seconds</p>
                    </section>
                }
                {type !== "cancel" && (
                    <>
                        <CustomField
                            control={form.control}
                            name="primaryPhysician"
                            fieldType={FormFieldType.SELECT}
                            label="Doctor"
                            placeholder="Select a doctor"
                        >
                            {Doctors.map((doctor) => {
                                return (
                                    <SelectItem key={doctor.name} value={doctor.name}>
                                        <div className="flex cursor-pointer items-center gap-2">
                                            <Image src={doctor.image} height={32} width={32} alt="doctor" className="rounded-full border border-dark-500" />
                                            <p>{doctor.name}</p>
                                        </div>
                                    </SelectItem>
                                )
                            })}
                        </CustomField>
                        <CustomField
                            control={form.control}
                            fieldType={FormFieldType.DATE_PICKER}
                            name="schedule"
                            label="Expected appointment date"
                            showTimeSelect
                            dateFormat="MM/dd/yyyy - h:mm aa"
                        />
                        <div className="flex flex-col gap-6 xl:flex-row">
                            <CustomField
                                control={form.control}
                                fieldType={FormFieldType.TEXTAREA}
                                name="reason"
                                label="Reason for appointment"
                                placeholder="Enter reason for appointment"
                            />
                            <CustomField
                                control={form.control}
                                fieldType={FormFieldType.TEXTAREA}
                                name="note"
                                label="Notes"
                                placeholder="Enter notes"
                            />
                        </div>
                    </>
                )}
                {type === "cancel" && (
                    <CustomField
                        control={form.control}
                        fieldType={FormFieldType.TEXTAREA}
                        name="cancellationReason"
                        label="Reason for cancellation"
                        placeholder="Enter reason for cancellation"
                    />
                )}
                <SubmitButton isLoading={isLoading} className={`${type === "cancel" ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}>{buttonLabel}</SubmitButton>
            </form>
        </Form>
    )
}

export default AppointmentForm