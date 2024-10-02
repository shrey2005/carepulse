import { StatusIcon } from '@/constant';
import clsx from 'clsx';
import React from 'react';
import Image from 'next/image';

const StatusBadge = ({ status }: { status: Status }) => {
    return (
        <div className={clsx('status-badge', {
            'bg-green-600': status.toLowerCase() === 'scheduled',
            'bg-blue-600': status.toLowerCase() === 'Pending',
            'bg-red-600': status.toLowerCase() === 'Cancelled'
        })}>
            <Image src={StatusIcon[status]} height={24} width={24} alt={status} className="h-fit w-3" />
            <p className={clsx('text-12-semibold capitalize', {
                'text-green-500': status.toLowerCase() === 'scheduled',
                'text-blue-500': status.toLowerCase() === 'pending',
                'text-red-500': status.toLowerCase() === 'cancelled'
            })}>{status}</p>
        </div>
    )
}

export default StatusBadge