'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteTourButton({ tourId, tourTitle }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${tourTitle}"? This action cannot be undone.`)) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch('/api/tours/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tourId }),
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Failed to delete tour')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('An error occurred while deleting the tour')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="flex-1 md:flex-none px-3 py-2 md:py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  )
}
