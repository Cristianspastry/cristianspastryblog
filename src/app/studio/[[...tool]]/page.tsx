/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import config from '../../../../sanity.config'

// Import dinamico per evitare problemi di SSR
const NextStudio = dynamic(() => import('next-sanity/studio').then((mod) => mod.NextStudio), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Caricamento Sanity Studio...</p>
      </div>
    </div>
  )
})

export default function StudioPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Sopprime gli errori di sviluppo di React per le props non riconosciute di Sanity
    const originalError = console.error
    console.error = (...args) => {
      if (
        typeof args[0] === 'string' &&
        args[0].includes('React does not recognize the') &&
        args[0].includes('disableTransition')
      ) {
        return
      }
      originalError.apply(console, args)
    }

    return () => {
      console.error = originalError
    }
  }, [])

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento Sanity Studio...</p>
        </div>
      </div>
    )
  }

  return <NextStudio config={config} />
}