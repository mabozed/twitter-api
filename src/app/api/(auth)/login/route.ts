import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../../prisma'
import bcrypt from 'bcryptjs'
// import { verifyToken } from '@/utils/verifyToken'
import { setCookie } from '@/utils/generateToken'

/**
 *  @method  POST
 *  @route   ~/api/users/login
 *  @desc    LogIn
 *  @access  public
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    if (!email && !password) {
      return NextResponse.json({ error: 'Invalid Data' }, { status: 422 })
    }
    const existingUser = await prisma.user.findFirst({ where: { email } })

    if (!existingUser) {
      return NextResponse.json(
        { message: 'user not Registered' },
        { status: 404 }
      )
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    )
    if (!isPasswordCorrect) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 403 })
    }

    // const userFromToken = verifyToken(request)
    const HeaderToken = request.headers.get('token')
    if (HeaderToken === null || HeaderToken !== existingUser.token) {
      return NextResponse.json(
        { message: 'you are not allowed, access denied' },
        { status: 403 }
      )
    }

    const token = existingUser.token
    const cookie = setCookie(token)

    return NextResponse.json(
      { message: 'Authenticated', token },
      {
        status: 200,
        headers: { 'Set-Cookie': cookie },
      }
    )
    // return NextResponse.json(user, { status: 200 })
  } catch (error) {
    // @ts-expect-error error
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
