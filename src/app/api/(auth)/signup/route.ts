import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma'
import bcrypt from 'bcryptjs'
import { setCookie } from '@/utils/generateToken'

/**
 *  @method  POST
 *  @route   ~/api/users/signup
 *  @desc    Register
 *  @access  public
 */
export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()
    if (!name && !email && !password) {
      return NextResponse.json({ error: 'Invalid Data' }, { status: 422 })
    }
    const existingUser = await prisma.user.findFirst({ where: { email } })
    if (existingUser) {
      return NextResponse.json(
        {
          message: 'User already registered, Please LogIn',
        },
        { status: 403 }
      )
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    })

    const cookie = setCookie({
      id: user.id,
      name: user.name,
      email: user.email,
    })

    if (!user) {
      return NextResponse.json({ message: 'user not found' }, { status: 404 })
    }

    return NextResponse.json(
      { ...user, message: 'Registered & Authenticated' },
      {
        status: 201,
        headers: { 'Set-Cookie': cookie },
      }
    )
  } catch (error) {
    // @ts-expect-error error
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
