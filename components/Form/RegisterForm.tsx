"use client"

import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import axios from 'axios';
import { z } from "zod"

import { createUser } from "@/lib/actions/patient.actions"
import { Button } from "@/components/ui/button"
import { Form, FormControl } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import SubmitButton from "@/components/SubmitButton"
import CustomField from "../CustomField"
import { PatientFormValidation } from "@/lib/validation"
import { Doctors, genderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constant"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import FileUploder from "../FileUploder"

export enum FormFieldType {
  INPUT = "input",
  CHECKBOX = "checkbox",
  TEXTAREA = "textarea",
  SELECT = "select",
  PHONE_INPUT = "phoneInput",
  DATE_PICKER = "datePicker",
  SKELETON = "skeleton",
}

const RegisterForm = ({ user }: { user: User }) => {

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: ""
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    console.log('on submit data : ', values)
    setIsLoading(true)

    let formData

    if (values.identificationDocument && values.identificationDocument?.length > 0) {
      const blobFile = new Blob([values.identificationDocument[0]], { type: values.identificationDocument[0].type })

      formData = new FormData();
      formData.append('blobFile', blobFile);
      formData.append('fileName', values.identificationDocument[0].name);
    }

    try {
      const patientData = {
        // userId: user.$id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        dob: values.birthDate,
        gender: values.gender,
        address: values.address,
        occupation: values.occupation,
        emergancyContactName: values.emergencyContactName,
        emergancyContactPhone: values.emergencyContactNumber,
        primaryPhysician: values.primaryPhysician,
        insuranceProvider: values.insuranceProvider,
        insurancePolicyNumber: values.insurancePolicyNumber,
        allergies: values.allergies,
        currentMedication: values.currentMedication,
        familyMedicalHistory: values.familyMedicalHistory,
        pastMedicalHistory: values.pastMedicalHistory,
        identificationNumber: values.identificationNumber,
        identificationType: values.identificationType,
        identificationDocument: formData
      }

      console.log(patientData, 'patient data')

      axios
        .post("http://localhost:3007/api/createpatient", patientData)
        .then((response) => {
          console.log(response);
          if (response) {
            router.push(`/paitents/${response.$id}/new-appointment`)
          }
        });

      // console.log('New User: ', newUser)  

      // const response = await newUser.json();

      // if (response) {    
      //   router.push(`/paitents/${response.$id}/register`)
      // }
    } catch (error) {
      console.log(error)
    }

    console.log(values)

    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
        <section className="space-y-4">
          <h1 className="header">Welcome </h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>
          {/* NAME */}
          <CustomField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="name"
            placeholder="John Doe"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user" />
          <div className="flex flex-col gap-6 xl:flex-row">
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
              label="Phone Number"
              placeholder="+91 9876543210"
            />
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomField
              control={form.control}
              fieldType={FormFieldType.DATE_PICKER}
              name="birthDate"
              label="Date of Birth"
            />
            <CustomField
              control={form.control}
              fieldType={FormFieldType.SKELETON}
              name="gender"
              label="Gender"
              renderSkeleton={(field) => (<FormControl>
                <RadioGroup
                  className="flex h-11 gap-6 xl:justify-between"
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  {genderOptions.map((option, i) => (
                    <div key={option + i} className="radio-group">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              )}
            />
          </div>
        </section>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="address"
            label="Address"
            placeholder="14th Street, New york "
          />
          <CustomField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="occupation"
            label="Occupation"
            placeholder="Software Engineer"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="emergencyContactName"
            label="Emergency Contact Name"
            placeholder="Guardian's name"
          />
          <CustomField
            control={form.control}
            fieldType={FormFieldType.PHONE_INPUT}
            name="emergencyContactNumber"
            label="Emergancy Contact Number"
            placeholder="+91 9876543210"
          />
        </div>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information</h2>
          </div>
        </section>
        <CustomField
          control={form.control}
          fieldType={FormFieldType.SELECT}
          name="primaryPhysician"
          label="Primary Physician"
          placeholder="Select a Physician"
        >
          {Doctors.map((doctor) => {
            return (
              <SelectItem key={doctor.name} value={doctor.name}>
                <div className="flex curosor-pointer items-center gap-2">
                  <Image src={doctor.image} alt="doctor" width="32" height="32" className="rounded-full border border-dark-500" />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            )
          })}
        </CustomField>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="insuranceProvider"
            label="Insurance Provider"
            placeholder="BlueCross BlueShield"
          />
          <CustomField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="insurancePolicyNumber"
            label="Insurance Policy Number"
            placeholder="ABC1123456789"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="allergies"
            label="Allergies"
            placeholder="Peanuts"
          />
          <CustomField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="currentMedication"
            label="Current medications (if any)"
            placeholder="Iburofen 200mg"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="familyMedicalHistory"
            label="Family Medical History"
            placeholder="Mother had brain cancer"
          />
          <CustomField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="pasrMedicalHistory"
            label="Past Medical History"
            placeholder="Appendectomy"
          />
        </div>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and verification</h2>
          </div>
          <CustomField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            name="identificationType"
            label="Identification Type"
            placeholder="Select an identification type"
          >
            {IdentificationTypes.map((identification) => {
              return (
                <SelectItem key={identification} value={identification}>
                  {identification}
                </SelectItem>
              )
            })}
          </CustomField>
          <CustomField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="idenntificationNumber"
            label="Identification Number"
            placeholder="123456789"
          />
          <CustomField
            control={form.control}
            fieldType={FormFieldType.SKELETON}
            name="identificationDocument"
            label="Scan copy of identification document"
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploder files={field.value} onChange={field.onChange} />
              </FormControl>
            )}
          />
        </section>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>
          <CustomField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="treatmentConsent"
            label="I consent to treatment"
          />
          <CustomField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="disclosureConsent"
            label="I consent to disclosure of information"
          />
          <CustomField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="privacyConsent"
            label="I consent to privacy consent"
          />
        </section>
        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  )
}

export default RegisterForm;