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


export async function POST(request: NextRequest) {
    try {
        const body = request?.body && await request.json();

        console.log("post body:", body, body?.query);

        const sql = await getPool()
        const result = await sql.query(body?.query)

        console.log("sql query: ", body?.query, ", result:",JSON.stringify(result))
        return new Response(
            JSON.stringify({
                success: true,
                result: result
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
                error: error.message
            }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
}