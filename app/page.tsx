import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { IEvent } from "@/database";
import { cacheLife } from "next/cache";
import events from "@/lib/constants"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Page = async () => {
    'use cache';
    cacheLife('hours');

    // Ensure BASE_URL has protocol
    // const baseUrl = BASE_URL?.startsWith('http') ? BASE_URL : `https://${BASE_URL}`;

    // const response = await fetch(`${baseUrl}/api/events`, {
    //     next: { revalidate: 3600 }
    // });

    // if (!response.ok) {
    //     return (
    //         <section>
    //             <h1 className="text-center">Unable to load events</h1>
    //         </section>
    //     );
    // }

    // const { events } = await response.json();

    return (
        <section>
            <h1 className="text-center">The Hub for Every Dev <br /> Event You Can't Miss</h1>
            <p className="text-center mt-5">Hackathons, Meetups, and Conferences, All in One Place</p>

            <ExploreBtn />
            <div className="mt-20 space-y-7">
                <h3>Featured Events</h3>

                <ul className="events">
                    {events && events.length > 0 && events.map((event: IEvent) => (
                        <li key={event.title} className="list-none">
                            <EventCard {...event} />
                        </li>
                    ))}
                </ul>

            </div>
        </section>
    )
}
export default Page
