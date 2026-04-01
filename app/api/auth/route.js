import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { signToken, getUserFromRequest } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, name, email, password, phone } = body;
    await connectDB();

    // ===== SIGNUP =====
    if (action === 'signup') {
      if (!name || !email || !password) {
        return NextResponse.json({ error: 'Name, email and password required' }, { status: 400 });
      }
      const exists = await User.findOne({ email });
      if (exists) return NextResponse.json({ error: 'Email already registered' }, { status: 409 });

      const user = await User.create({ name, email, password, phone: phone || '' });
      const token = signToken({ id: user._id.toString(), email: user.email, role: user.role, name: user.name });

      const res = NextResponse.json({ message: 'Account created!', user: user.toSafeObject(), token });
      res.cookies.set('auth_token', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: '/' });
      return res;
    }

    // ===== LOGIN =====
    if (action === 'login') {
      if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 });

      const user = await User.findOne({ email });
      if (!user) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });

      const valid = await user.comparePassword(password);
      if (!valid) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });

      const token = signToken({ id: user._id.toString(), email: user.email, role: user.role, name: user.name });
      user.lastLogin = new Date();
      await user.save();

      const res = NextResponse.json({ message: 'Login successful', user: user.toSafeObject(), token });
      res.cookies.set('auth_token', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: '/' });
      return res;
    }

    // ===== LOGOUT =====
    if (action === 'logout') {
      const res = NextResponse.json({ message: 'Logged out' });
      res.cookies.delete('auth_token');
      return res;
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// GET /api/auth — get current user
export async function GET(request) {
  try {
    const userData = await getUserFromRequest(request);
    if (!userData) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    await connectDB();
    const user = await User.findById(userData.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ user: user.toSafeObject() });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
