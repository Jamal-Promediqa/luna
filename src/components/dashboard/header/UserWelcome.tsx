import { useState, useEffect } from "react";
import { getWeek } from "date-fns";
import { sv } from "date-fns/locale";

interface UserWelcomeProps {
  givenName: string;
}

export const UserWelcome = ({ givenName }: UserWelcomeProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const weekNumber = getWeek(currentTime, { locale: sv });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">
        Välkommen tillbaka, {givenName || 'Användare'}
      </h1>
      <div className="flex items-center gap-2 text-muted-foreground">
        <span>
          {currentTime.toLocaleTimeString("sv-SE", {
            hour: "2-digit",
            minute: "2-digit"
          })}
        </span>
        <span className="text-copilot-gray">•</span>
        <span>
          {new Date().toLocaleDateString("sv-SE", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          })}
        </span>
        <span className="text-copilot-gray">•</span>
        <span>Vecka {weekNumber}</span>
      </div>
    </div>
  );
};