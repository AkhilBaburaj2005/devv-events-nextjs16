'use server';
import Booking from "@/database/booking.model";
import connectDB from "@/lib/mongodb";

export const createBooking = async ({ eventId, slug, email }: { eventId: string, slug: string, email: string }) => {
    // Validate inputs
    if (!eventId || typeof eventId !== 'string') {
        return { success: false, error: 'Invalid event ID' };
    }
    if (!slug || typeof slug !== 'string') {
        return { success: false, error: 'Invalid slug' };
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
        return { success: false, error: 'Invalid email address' };
    } 
    try {
        await connectDB();

        // Create the booking in the database
        await Booking.create({ eventId, slug, email });

        return { success: true };
    } catch (e) {
        console.error('create booking failed', e);
        return { success: false, error: e instanceof Error ? e.message : 'Unknown error' };
    }
}