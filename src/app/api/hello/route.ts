import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    return new Response('Hello from GET!', {
        status: 200,
    });
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    return new Response(JSON.stringify({ message: 'Hello from POST!', data: body }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export async function PUT(request: NextRequest) {
    const body = await request.json();
    return new Response(JSON.stringify({ message: 'Hello from PUT!', data: body }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
