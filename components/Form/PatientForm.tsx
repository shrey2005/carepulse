"use client"

import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import axios from 'axios';
import { z } from "zod"

import { createUser } from "@/lib/actions/patient.actions"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import SubmitButton from "@/components/SubmitButton"
import CustomField from "../CustomField"
import { UserFormValidation } from "@/lib/validation"

export enum FormFieldType {
  INPUT = "input",
  CHECKBOX = "checkbox",
  TEXTAREA = "textarea",
  SELECT = "select",
  PHONE_INPUT = "phoneInput",
  DATE_PICKER = "datePicker",
  SKELETON = "skeleton",
}

const PatientForm = () => {

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: ""
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof UserFormValidation>) {
    setIsLoading(true)

    try {
      const userData = { name: values.name, email: values.email, phone: values.phone }

      axios
        .post("http://localhost:3007/api/createpatient", userData)
        .then((response) => {
          if (response) {
            router.push(`/paitents/${response?.data?.id}/register`)
          }
        });

    } catch (error) {
      console.log(error)
    }
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there </h1>
          <p className="text-dark-700">Schedule your first appointment.</p>
        </section>
        <CustomField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="name"
          label="Full Name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user" />
        <CustomField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="email"
          label="Email"
          placeholder="jhon.doe@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="user" />
        <CustomField
          control={form.control}
          fieldType={FormFieldType.PHONE_INPUT}
          name="phone"
          label="Phone"
          placeholder="+91 9876543210"
        />
        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  )
}

export default PatientForm;