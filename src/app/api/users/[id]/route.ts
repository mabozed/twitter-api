import { NextResponse, NextRequest } from 'next/server'

// import { verifyToken } from '@/utils/verifyToken'

import prisma from '../../../../../prisma'
import { verifyToken } from '@/utils/verifyToken'

interface Props {
  params: { id: string }
}

/**
 *  @method  GET
 *  @route   ~/api/users/:id
 *  @desc    Get Profile By Id
 *  @access  private (only user himself can get his account/profile)
 */
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: { tweets: true, _count: true },
    })

    if (!user) {
      return NextResponse.json({ message: 'user not found' }, { status: 404 })
    }

    const userFromToken = verifyToken(request)

    if (userFromToken === null || userFromToken.email !== user.email) {
      return NextResponse.json(
        { message: 'you are not Logged In' },
        { status: 403 }
      )
    }

    // const HeaderToken = request.headers.get('token')
    // if (HeaderToken === null || HeaderToken !== user.token) {
    //   return NextResponse.json(
    //     { message: 'you are not allowed, access denied' },
    //     { status: 403 }
    //   )
    // }

    return NextResponse.json(user, { status: 200 })
    // eslint-disable-next-line
  } catch (error) {
    return NextResponse.json(
      { message: 'internal server error' },
      { status: 500 }
    )
  }
}
