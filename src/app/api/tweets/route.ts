import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../prisma'

/**
 *  @method  GET
 *  @route   ~/api/tweets
 *  @desc    Get Tweets
 *  @access  public
 */
export async function GET() {
  try {
    const tweets = await prisma.tweets.findMany()
    console.log(tweets)

    if (!tweets) {
      return NextResponse.json({ message: 'tweet not found' }, { status: 404 })
    }

    // const userFromToken = verifyToken(request)
    // if (userFromToken === null || userFromToken.id !== user.id) {
    //   return NextResponse.json(
    //     { message: 'you are not allowed, access denied' },
    //     { status: 403 }
    //   )
    // }

    return NextResponse.json(tweets, { status: 200 })
  } catch (error) {
    // @ts-expect-error error
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/**
 *  @method  POST
 *  @route   ~/api/tweets
 *  @desc    Create New Tweet
 *  @access  private
 */
export async function POST(request: NextRequest) {
  try {
    const { tweet, userId } = await request.json()
    if (!tweet && !userId) {
      return NextResponse.json({ error: 'Invalid Data' }, { status: 422 })
    }
    const user = await prisma.user.findFirst({ where: { id: userId } })

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
    const newTweet = await prisma.tweets.create({ data: { tweet, userId } })
    return NextResponse.json({ tweet: newTweet }, { status: 201 })

    // return NextResponse.json(user, { status: 200 })
  } catch (error) {
    // @ts-expect-error error
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
