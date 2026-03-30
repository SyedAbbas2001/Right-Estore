import { NextResponse } from 'next/server';

// Demo users store (use MongoDB in production)
const users = [
  {
    id: 'u001',
    name: 'Demo User',
    email: 'demo@rightestore.pk',
    password: 'password123', // In production: bcrypt hashed
    role: 'user',
  },
  {
    id: 'admin001',
    name: 'Admin User',
    email: 'admin@rightestore.pk',
    password: 'admin123',
    role: 'admin',
  },
];

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, email, password, name, phone } = body;

    if (action === 'login') {
      const user = users.find(u => u.email === email);

      if (!user || user.password !== password) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // In production: generate real JWT
      const token = Buffer.from(JSON.stringify({
        id: user.id,
        email: user.email,
        role: user.role,
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
      })).toString('base64');

      return NextResponse.json({
        message: 'Login successful',
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        token,
      });
    }

    if (action === 'signup') {
      if (!name || !email || !password) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
      }

      const exists = users.find(u => u.email === email);
      if (exists) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
      }

      const newUser = {
        id: `u${Date.now()}`,
        name,
        email,
        phone: phone || '',
        password, // hash in production
        role: 'user',
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);

      return NextResponse.json({
        message: 'Account created successfully!',
        user: { id: newUser.id, name: newUser.name, email: newUser.email },
      }, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
