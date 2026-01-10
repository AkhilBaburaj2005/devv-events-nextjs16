import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

import connectDB from "@/lib/mongodb";
import Event from '@/database/event.model';

// /event/nextjs-conf-2025

// Configure Cloudinary
cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL
});

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        let formData;
        try {
            formData = await req.formData();
        } catch (parseError) {
            console.error('FormData parsing error:', parseError);
            return NextResponse.json({
                message: 'Failed to parse FormData',
                error: parseError instanceof Error ? parseError.message : 'Unknown parsing error',
                hint: 'Make sure Content-Type is multipart/form-data and not manually set'
            }, { status: 400 });
        }

        // Extract the image file
        const file = formData.get('image') as File;
        if (!file) {
            return NextResponse.json({ message: 'Image file is required' }, { status: 400 });
        }

        // Parse tags and agenda as arrays (they come as JSON strings from FormData)
        const tagsString = formData.get('tags') as string;
        const agendaString = formData.get('agenda') as string;

        let tags: string[] = [];
        let agenda: string[] = [];

        try {
            tags = tagsString ? JSON.parse(tagsString) : [];
            agenda = agendaString ? JSON.parse(agendaString) : [];
        } catch (e) {
            return NextResponse.json({
                message: 'Invalid tags or agenda format. Must be valid JSON arrays.'
            }, { status: 400 });
        }

        // Upload image to Cloudinary
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { resource_type: 'image', folder: 'DevEvent' },
                (error, results) => {
                    if (error) return reject(error);
                    resolve(results);
                }
            ).end(buffer);
        });

        const imageUrl = (uploadResult as { secure_url: string }).secure_url;

        // Create event with all fields
        const createdEvent = await Event.create({
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            overview: formData.get('overview') as string,
            venue: formData.get('venue') as string,
            location: formData.get('location') as string,
            date: formData.get('date') as string,
            time: formData.get('time') as string,
            mode: formData.get('mode') as string,
            audience: formData.get('audience') as string,
            organizer: formData.get('organizer') as string,
            tags: tags,
            agenda: agenda,
            image: imageUrl,
        });

        return NextResponse.json({
            message: 'Event created successfully',
            event: createdEvent
        }, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({
            message: 'Event Creation Failed',
            error: e instanceof Error ? e.message : 'Unknown'
        }, { status: 500 });
    }
}

export async function GET() {
    try{
        await connectDB();
        const events = await Event.find().sort({ createdAt: -1});
        return NextResponse.json({ message: 'Events fetched successfully', events}, { status: 200});
    } catch (e) {
        return NextResponse.json({ message: 'Event fetching failed', error: e }, { status: 500});
    }
}

// a route that accepts a slug as input -> returns the event details