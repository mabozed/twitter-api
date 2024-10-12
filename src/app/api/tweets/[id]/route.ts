import { NextRequest, NextResponse } from 'next/server'
// import { NextResponse } from 'next/server'
import prisma from '../../../../../prisma'
// import { verifyToken } from '@/utils/verifyToken'

interface tweetsProps {
  params: { id: string }
}

/**
 *  @method  GET
 *  @route   ~/api/tweets/:id
 *  @desc    Get Tweet by id
 *  @access  public
 */

export async function GET(request: NextRequest, { params }: tweetsProps) {
  try {
    const tweet = await prisma.tweets.findFirst({
      where: { id: params.id },
    })

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

export async function PUT(request: NextRequest, { params }: tweetsProps) {
  try {
    const { newTweet } = await request.json()

    const tweet = await prisma.tweets.findFirst({
      where: { id: params.id },
    })

    if (!tweet) {
      return NextResponse.json(
        { error: 'the tweet is Not Found' },
        { status: 404 }
      )
    }

    if (!newTweet) {
      return NextResponse.json({ error: 'Invalid Data' }, { status: 422 })
    }

    const HeaderToken = request.headers.get('token')
    if (HeaderToken) {
      const user = await prisma.user.findFirst({
        where: { token: HeaderToken },
      })

      if (!user || tweet.userId !== user.id) {
        return NextResponse.json({ message: 'Invalid User' }, { status: 500 })
      }
      // const userFromToken = verifyToken(req)

      if (HeaderToken === null || HeaderToken !== user.token) {
        return NextResponse.json(
          { message: 'you are not allowed, access denied' },
          { status: 403 }
        )
      }
    }

    const updatedTweet = await prisma.tweets.update({
      data: { tweet: newTweet },
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
    const HeaderToken = request.headers.get('token')
    if (HeaderToken) {
      const user = await prisma.user.findFirst({
        where: { token: HeaderToken },
      })
      if (!user) {
        return NextResponse.json({ message: 'Invalid User' }, { status: 500 })
      }
      // const userFromToken = verifyToken(req)

      if (HeaderToken === null || HeaderToken !== user.token) {
        return NextResponse.json(
          { message: 'you are not allowed, access denied' },
          { status: 403 }
        )
      }
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
