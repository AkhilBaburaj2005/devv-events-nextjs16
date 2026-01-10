'use server';

import { cache } from 'react';
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

export const getSimilarEventsBySlug = cache(async (slug: string) => {
    try {
        await connectDB();

        const event = await Event.findOne({ slug }).lean();

        // If event not found, return empty array
        if (!event) return [];

        const similarEvents = await Event.find({
            _id: { $ne: event._id },
            tags: { $in: event.tags }
        }).lean();

        // Convert ObjectIds to strings for serialization
        return similarEvents.map(e => ({
            ...e,
            _id: e._id.toString(),
            slug: e.slug
        }));
    } catch (error) {
        console.error('Error fetching similar events:', error);
        return [];
    }
});