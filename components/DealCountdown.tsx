"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";

// Calculate time remaining
const calculateTimeRemaining = (targetDate: Date) => {
  const currentTime = new Date();
  const timeDifference = Math.max(Number(targetDate) - Number(currentTime), 0);
  return {
    days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
    hours: Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    ),
    minutes: Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((timeDifference % (1000 * 60)) / 1000),
  };
};

const DealCountdown = ({
  dealEndingTime,
  promoImageUrl,
}: {
  dealEndingTime: Date;
  promoImageUrl: string;
}) => {
  const [time, setTime] = useState<ReturnType<typeof calculateTimeRemaining>>();

  useEffect(() => {
    // Calculate initial time remaining on the client
    setTime(calculateTimeRemaining(dealEndingTime));

    const timerInterval = setInterval(() => {
      const newTime = calculateTimeRemaining(dealEndingTime);
      setTime(newTime);

      // Clear when countdown is over
      if (
        newTime.days === 0 &&
        newTime.hours === 0 &&
        newTime.minutes === 0 &&
        newTime.seconds === 0
      ) {
        clearInterval(timerInterval);
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  // Render a loading state during hydration
  if (!time) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 my-20">
        <div className="flex flex-col gap-2 justify-center">
          <h3 className="text-3xl font-bold">Loading Countdown...</h3>
        </div>
      </section>
    );
  }

  // If the countdown is over, display fallback UI
  if (
    time.days === 0 &&
    time.hours === 0 &&
    time.minutes === 0 &&
    time.seconds === 0
  ) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 my-20">
        <div className="flex flex-col gap-2 justify-center">
          <h3 className="text-3xl font-bold">Deal Has Ended</h3>
          <p>
            This deal is no longer available. Check out our latest promotions!
          </p>
          <div className="text-center">
            <Button asChild>
              <Link href="/search">View Products</Link>
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
          <Image src={promoImageUrl} alt="promotion" width={300} height={200} />
        </div>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 my-20">
      <div className="flex flex-col gap-2 justify-center">
        <h3 className="text-3xl font-bold">Deal Of The Month</h3>
        <p>
          Discover unbeatable savings with our Deal of the Month! Enjoy
          exclusive perks and special offers on every purchase. Make this month
          unforgettable with incredible deals tailored just for you. Don&apos;t
          wait—shop now and save big! 🎁🛒
        </p>
        <ul className="grid grid-cols-4">
          <RemainingTimeBox label="Days" value={time.days} />
          <RemainingTimeBox label="Hours" value={time.hours} />
          <RemainingTimeBox label="Minutes" value={time.minutes} />
          <RemainingTimeBox label="Seconds" value={time.seconds} />
        </ul>
        <div className="text-center">
          <Button asChild>
            <Link href="/search">View Products</Link>
          </Button>
        </div>
      </div>
      <div className="flex justify-center">
        <Image src={promoImageUrl} alt="promotion" width={300} height={200} />
      </div>
    </section>
  );
};

const RemainingTimeBox = ({
  label,
  value,
}: {
  label: string;
  value: number;
}) => (
  <li className="p-4 w-full text-center">
    <p className="text-3xl font-bold">{value}</p>
    <p>{label}</p>
  </li>
);

export default DealCountdown;
