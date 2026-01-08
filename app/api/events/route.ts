import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const event = await req.json();

        const createdEvent = await Event.create(event);

        return NextResponse.json({ message: 'Event created successfully', event: createdEvent }, { status: 201 })
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Event creation Failed', error: e instanceof Error ? e.message : 'Unknown' }, { status: 500 })
    }
}