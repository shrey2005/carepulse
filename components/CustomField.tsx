"use client"

import React from 'react';
import { E164Number } from "libphonenumber-js/core";

import 'react-phone-number-input/style.css'

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control } from 'react-hook-form';
import PhoneInput from 'react-phone-number-input'
import Image from 'next/image';
import { FormFieldType } from './Form/PatientForm';

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';

interface CustomProps {
    control: Control<any>,
    fieldType: FormFieldType,
    name: string,
    label?: string,
    placeholder?: string,
    iconSrc?: string,
    iconAlt?: string,
    disabled?: boolean,
    dateFormat?: string;
    showTimeSelect?: boolean,
    children?: React.ReactNode,
    className?: string,
    renderSkeleton?: (field: any) => React.ReactNode
}

const RenderField = ({ field, props }: { field: any, props: CustomProps }) => {
    const { fieldType, iconSrc, iconAlt, placeholder, dateFormat, showTimeSelect, renderSkeleton, disabled } = props

    switch (fieldType) {
        case FormFieldType.INPUT:
            return (
                <div className='flex rounded-md border border-dark-500 bg-dark-400'>
                    {iconSrc && <Image src={iconSrc} alt={iconAlt || 'icon'} height={24} width={24} className='ml-2' />}
                    <FormControl>
                        <Input placeholder={placeholder} {...field} className="shad-input border-0" />
                    </FormControl>
                </div>
            )
        case FormFieldType.PHONE_INPUT:
            return (
                <FormControl>
                    <PhoneInput
                        defaultCountry="IN"
                        placeholder={placeholder}
                        international
                        value={field.value as E164Number | undefined}
                        onChange={field.onChange}
                        className="input-phone"
                    />
                </FormControl>
            )
        case FormFieldType.DATE_PICKER:
            return (
                <div className="flex rounded-md border border-dark-500 bg-dark-400">
                    <Image src="/assets/icons/calendar.svg" alt="calender" height={24} width={24} className="ml-2" />
                    <FormControl>
                        <DatePicker
                            selected={field.value}
                            onChange={(value) => field.onChange(value)}
                            dateFormat={dateFormat ?? "MM/dd/yyyy"}
                            showTimeSelect={showTimeSelect ?? false}
                            timeInputLabel='Time:'
                            wrapperClassName="date-picker"
                        />
                    </FormControl>
                </div>
            )
        case FormFieldType.SELECT:
            return (
                <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger className='shad-select-trigger'>
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent className='shad-select-content'>
                            {props.children}
                        </SelectContent>
                    </Select>
                </FormControl>
            )
        case FormFieldType.TEXTAREA:
            return (
                <FormControl>
                    <Textarea placeholder={placeholder} {...field} className="shad-textarea" disabled={disabled} />
                </FormControl>
            )
        case FormFieldType.CHECKBOX:
            return (
                <div className="flex items-center gap-4">
                    <Checkbox id={props.name} checked={field.value} onCheckedChange={field.onChange} />
                    <label htmlFor={props.name} className="checkbox-label">
                        {props.label}
                    </label>
                </div>
            )
        case FormFieldType.SKELETON:
            return renderSkeleton ? renderSkeleton(field) : null;
        default:
            return null
    }
}

export default function CustomField(props: CustomProps) {
    const { control, fieldType, name, label, className } = props
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex-1">
                    {fieldType !== FormFieldType.CHECKBOX && label && <FormLabel>{label}</FormLabel>}
                    <RenderField field={field} props={props} />
                    <FormMessage className="shad-error" />
                </FormItem>
            )}
        />

    )
}