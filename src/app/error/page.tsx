'use client'

import { useSearchParams } from 'next/navigation'

export default function ErrorPage() {
    const searchParams = useSearchParams()
    const errorMessage = searchParams.get('message')

    return (
        <div>
            <h2>An Error Occurred</h2>
            <p>{errorMessage || 'An unknown error occurred.'}</p>
        </div>
    )
}