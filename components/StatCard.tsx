import React from 'react';
import clsx from 'clsx';
import Image from 'next/image';

interface StateCardProps {
    count: number,
    label: string,
    icons: string,
    type: 'appointments' | 'pending' | 'cancelled'
}

const StatCard = ({ count, label, icons, type }: StateCardProps) => {
    return (
        <div className={clsx('stat-card', {
            'bg-appointments': type === 'appointments',
            'bg-pending': type === 'pending',
            'bg-cancelled': type === 'cancelled'
        })}>
            <div className="flex items-center gap-4">
                <Image src={icons} height={32} width={32} alt={label} className="size-8 w-fit" />
                <h2 className="text-32-bold text-white">{count}</h2>
            </div>
            <p className="text-14-regular text-white">{label}</p>
        </div>
    )
}

export default StatCard;