import { NextResponse } from 'next/server'
import prisma from '../../../../prisma'

/**
 *  @method  GET
 *  @route   ~/api/users
 *  @desc    Get Users
 *  @access  public
 */
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: { tweets: true, _count: true },
    })
    console.log(users)

    if (!users) {
      return NextResponse.json({ message: 'user not found' }, { status: 404 })
    }

    return NextResponse.json(users, { status: 200 })
  } catch (error) {
    // @ts-expect-error error
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
