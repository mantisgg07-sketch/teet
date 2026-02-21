'use client'

import { useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'

export default function VideoUpload({ videos = [], onUpload, onRemove }) {
    const [inputValue, setInputValue] = useState('')
    const isCloudinaryConfigured = !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    const handleAdd = () => {
        const url = inputValue.trim()
        if (url) {
            onUpload(url)
            setInputValue('')
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleAdd()
        }
    }

    return (
        <div className="space-y-4">
            {/* Upload Button */}
            {isCloudinaryConfigured ? (
                <CldUploadWidget
                    uploadPreset="ml_default"
                    onSuccess={(result) => {
                        if (result.event === 'success' && result.info?.secure_url) {
                            // For videos, we might want the public_id or the URL
                            // To work with CldVideoPlayer, public_id is preferred but secure_url works too
                            onUpload(result.info.public_id || result.info.secure_url)
                        }
                    }}
                    options={{
                        resourceType: 'video',
                        multiple: true,
                    }}
                >
                    {({ open }) => (
                        <button
                            type="button"
                            onClick={() => open()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                            Upload Videos
                        </button>
                    )}
                </CldUploadWidget>
            ) : (
                <div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter video public ID or URL"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                            type="button"
                            onClick={handleAdd}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
                        >
                            Add
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Cloudinary not configured. Paste a video public ID or URL and press Enter or click Add.
                    </p>
                </div>
            )}

            {/* Video Previews */}
            {videos.length > 0 && (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                    {videos.map((vid, index) => (
                        <div key={index} className="relative group bg-gray-100 rounded-lg p-3 border border-gray-200 flex items-center justify-between">
                            <div className="truncate text-sm text-gray-600 max-w-[80%]">
                                {typeof vid === 'string' ? vid : vid.public_id}
                            </div>
                            <button
                                type="button"
                                onClick={() => onRemove(index)}
                                className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
                                aria-label="Remove video"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
