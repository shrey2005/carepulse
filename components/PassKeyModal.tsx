"use client";

import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { encryptKey, decryptKey } from '@/lib/utils';

const PassKeyModal = () => {
    const router = useRouter();
    const path = usePathname();
    const [open, setOpen] = useState(true);
    const [passKey, setPassKey] = useState('');
    const [error, setError] = useState('')

    const encryptedKey = typeof window !== 'undefined' ? window.localStorage.getItem('accessKey') : ''

    const closeModal = () => {
        setOpen(false)
        router.push('/')
    }

    useEffect(() => {
        const accessKey = encryptedKey && decryptKey(encryptedKey)
        if (path) {
            if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
                setOpen(false)
                router.push('/admin')
            }
            else {
                setOpen(true)
            }
        }
    }, [encryptedKey])

    const valdatePassKey = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        if (passKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
            const encryptedKey = encryptKey(passKey)
            localStorage.setItem('accessKey', encryptedKey)
            setOpen(false)
        }
        else {
            setError('Invalid passKey. Pleae try again.')
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className="shad-alert-dialog">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-start justify-between">
                        Admin Access Verification
                        <Image src="/assets/icons/close.svg" height={20} width={20} alt="close" onClick={closeModal} className="cursor-pointer" />
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        To access the admin page, please enter the passkey.
                    </AlertDialogDescription>
                    <div>
                        <InputOTP maxLength={6} value={passKey} onChange={(value) => setPassKey(value)}>
                            <InputOTPGroup className="shad-otp">
                                <InputOTPSlot className="shad-otp-slot" index={0} />
                                <InputOTPSlot className="shad-otp-slot" index={1} />
                                <InputOTPSlot className="shad-otp-slot" index={2} />
                                <InputOTPSlot className="shad-otp-slot" index={3} />
                                <InputOTPSlot className="shad-otp-slot" index={4} />
                                <InputOTPSlot className="shad-otp-slot" index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                        {error && <p className="shad-error text-14-regular mt-4 flex justify-center">{error}</p>}
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction className="shad-primary-btn w-full" onClick={(e) => { valdatePassKey(e) }}>Enter Admin Passkey</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default PassKeyModal;