
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
import dynamicImport from 'next/dynamic'
import config from '../../../../sanity.config'

// Import dinamico per evitare problemi di SSR
const NextStudio = dynamicImport(() => import('next-sanity/studio').then(mod => ({ default: mod.NextStudio })), {
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
