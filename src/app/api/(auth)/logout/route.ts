import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 *  @method  GET
 *  @route   ~/api/logout
 *  @desc    Logout User
 *  @access  public
 */
export function GET() {
  try {
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
