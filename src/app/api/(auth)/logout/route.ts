import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 *  @method  GET
 *  @route   ~/api/logout
 *  @desc    Logout User
 *  @access  public
 */
export function GET(request: NextRequest) {
  try {
    const cookieToken = cookies().get('jwtToken')?.value as string

    const HeaderToken = request.headers.get('token')

    if (!HeaderToken || !cookieToken || cookieToken !== HeaderToken) {
      return NextResponse.json({ message: 'wrong Token' }, { status: 402 })
    }
    cookies().delete('jwtToken')

    return NextResponse.json({ message: 'logout' }, { status: 200 })
    // eslint-disable-next-line
  } catch (error) {
    return NextResponse.json(
      { message: 'internal server error' },
      { status: 500 }
    )
  }
}
