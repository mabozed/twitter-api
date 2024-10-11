import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../../prisma'
// import { verifyToken } from '@/utils/verifyToken'

/**
 *  @method  GET
 *  @route   ~/api/tweets/:id
 *  @desc    Get Tweet by id
 *  @access  public
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tweet = await prisma.tweets.findFirst({ where: { id: params.id } })

    if (!tweet) {
      return NextResponse.json({ message: 'tweet not found' }, { status: 404 })
    }

    return NextResponse.json(tweet, { status: 200 })
  } catch (error) {
    // @ts-expect-error error
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/**
 *  @method  PUT
 *  @route   ~/api/tweets/:id
 *  @desc    Update Tweet by id
 *  @access  private (Only User Can Edit)
 */

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { tweet, userId } = await request.json()

    if (!tweet && !userId) {
      return NextResponse.json({ error: 'Invalid Data' }, { status: 422 })
    }
    const user = await prisma.user.findFirst({ where: { id: userId } })

    if (!user) {
      return NextResponse.json({ message: 'Invalid User' }, { status: 500 })
    }
    // const userFromToken = verifyToken(req)

    const HeaderToken = request.headers.get('token')
    if (HeaderToken === null || HeaderToken !== user.token) {
      return NextResponse.json(
        { message: 'you are not allowed, access denied' },
        { status: 403 }
      )
    }

    const updatedTweet = await prisma.tweets.update({
      data: { tweet },
      where: { id: params.id },
    })

    return NextResponse.json({ tweet: updatedTweet }, { status: 200 })
  } catch (error) {
    // @ts-expect-error error
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/**
 *  @method  DELETE
 *  @route   ~/api/tweets/:id
 *  @desc    Delete Tweet by id
 *  @access  private (Only User Can Delete)
 */

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { tweet, userId } = await request.json()

    console.log(userId)

    if (!tweet && !userId) {
      return NextResponse.json({ error: 'Invalid Data' }, { status: 422 })
    }
    const user = await prisma.user.findFirst({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ message: 'Invalid User' }, { status: 500 })
    }
    const HeaderToken = request.headers.get('token')
    if (HeaderToken === null || HeaderToken !== user.token) {
      return NextResponse.json(
        { message: 'you are not allowed, access denied' },
        { status: 403 }
      )
    }

    const DeletedTweet = await prisma.tweets.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ DeletedTweet }, { status: 200 })
  } catch (error) {
    // @ts-expect-error error
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
