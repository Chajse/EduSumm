import {db} from "$lib/server/db"
import { user } from "$lib/server/db/schema";
import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    const data = await db.select().from(user);
    return json({ data: data });
};

export const POST: RequestHandler = async ({ request }) => {
    try {
        const raw = await request.text();
        console.log("Raw request body:", raw);

        const { name, age, email } = JSON.parse(raw); // parse manually
        const query = await db.insert(user).values({ name, age, email });

        return json({ success: true, query });
    } catch (error) {
        console.error("POST error:", error);
        return json({ success: false, error: String(error) }, { status: 500 });
    }
};

