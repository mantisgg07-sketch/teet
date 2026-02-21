'use client'

import { useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'

export default function ImageUpload({ images = [], onUpload, onRemove, isBanner = false }) {
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
              onUpload(result.info.secure_url)
            }
          }}
          options={{
            multiple: !isBanner,
            maxFiles: isBanner ? 1 : 10,
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition"
            >
              {isBanner ? 'Upload Banner Image' : 'Upload Images'}
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
              placeholder={isBanner ? "Enter banner image URL" : "Enter image URL"}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={handleAdd}
              className="px-6 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition font-medium"
            >
              Add
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Cloudinary not configured. Paste an image URL and press Enter or click Add.
          </p>
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className={`grid gap-4 ${isBanner ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <div className="relative h-40 w-full rounded-lg overflow-hidden border-2 border-gray-200">
                <Image
                  src={url}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition opacity-0 group-hover:opacity-100"
                aria-label="Remove image"
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
