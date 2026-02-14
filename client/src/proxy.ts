// proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const accessToken = request.cookies.get('accessToken')?.value;

    const isProtectedPath = request.nextUrl.pathname.startsWith('/chat');

    if (isProtectedPath && !accessToken) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/chat/:path*'], // Add more paths as needed
};
