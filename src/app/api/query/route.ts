import { type NextRequest } from 'next/server'
import sql from 'mssql';

const sqlConfig: sql.config = {

    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    server: process.env.DB_SERVER!,
    port: +process.env.DB_PORT! || 1433,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        trustServerCertificate: true,
        encrypt: false
    }
}

let pool: sql.ConnectionPool | null = null;

async function getPool() {
    if (!pool) {
        pool = await sql.connect(sqlConfig);
    }
    return pool;
}


export async function GET(request: NextRequest) {
    try {
        console.log(`sqlConfig`, sqlConfig)
        const sql = await getPool()
        const result = await sql.query`select * from sinh_vien`
        console.dir(result)
        return new Response(
            JSON.stringify({
                success: false,
                data: result
            }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    } catch (error: any) {
        console.error(error)
        return new Response(
            JSON.stringify({
                success: false,
                message: error.message
            }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
}

export async function POST(request: NextRequest) {
    await sql.connect(sqlConfig)
    const result = await sql.query`select * from mytable where id = 1`
    console.dir(result)
    const body = await request.json();
    return new Response(JSON.stringify({ message: 'Hello from POST!', data: body }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}