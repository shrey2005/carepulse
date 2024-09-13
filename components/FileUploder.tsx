"use client"

import Image from 'next/image';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import { convertFileToUrl } from '@/lib/utils';

type FileUploaderProps = {
    files: File[] | undefined,
    onChange: (files: File[]) => void
}
const FileUploder = ({ files, onChange }: FileUploaderProps) => {

    const onDrop = useCallback((acceptedFiles: File[]) => {
        onChange(acceptedFiles)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const { getRootProps, getInputProps } = useDropzone({
        onDrop
    })

    return (
        <div {...getRootProps()} className="file-upload">
            <input {...getInputProps()} />
            {files && files?.length > 0 ? (
                <Image src={convertFileToUrl(files[0])} height={1000} width={1000} alt="upload image" className="max-h-[400px] overflow-hidden object-cover" />
            ) : <>
                <Image src="/assets/icons/upload.svg" height={40} width={40} alt="upload" />
                <div className="file-upload_label">
                    <p className="text-14-regular">
                        <span className="text-green-500">
                            Click to upload
                        </span> or drag and drop
                    </p>
                    SVG, PNG, JPG or GIF (max 800*400)
                </div>
            </>}
        </div>
    )
}

export default FileUploder;