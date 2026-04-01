import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { getUserFromRequest } from '@/lib/auth';

export async function PUT(request) {
  try {
    const userData = await getUserFromRequest(request);
    if (!userData) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { name, phone, dob } = body;

    await connectDB();
    const user = await User.findByIdAndUpdate(
      userData.id,
      { name, phone, dob },
      { new: true }
    );
    return NextResponse.json({ user: user.toSafeObject() });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// Change password
export async function PATCH(request) {
  try {
    const userData = await getUserFromRequest(request);
    if (!userData) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { currentPassword, newPassword } = await request.json();
    await connectDB();

    const user = await User.findById(userData.id);
    const valid = await user.comparePassword(currentPassword);
    if (!valid) return NextResponse.json({ error: 'Current password is wrong' }, { status: 400 });

    user.password = newPassword;
    await user.save();
    return NextResponse.json({ message: 'Password updated!' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
