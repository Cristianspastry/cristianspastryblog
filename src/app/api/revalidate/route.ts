import { revalidateTag, revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  
  // Verifica il secret token
  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    // Revalida tutto il sito (opzione semplice)
    revalidatePath('/', 'layout')
    
    // OPPURE revalida pagine specifiche basate sul documento modificato
    // if (body._type === 'post') {
    //   revalidatePath('/blog')
    //   revalidatePath(`/blog/${body.slug?.current}`)
    // }
    
    console.log('✅ Revalidation successful')
    return NextResponse.json({ revalidated: true })
    
  } catch (error) {
    console.error('❌ Error revalidating:', error)
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
}