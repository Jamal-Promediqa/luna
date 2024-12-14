interface UserWelcomeProps {
  givenName: string;
}

export const UserWelcome = ({ givenName }: UserWelcomeProps) => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">
        Välkommen tillbaka, {givenName || 'Användare'}
      </h1>
      <p className="text-muted-foreground">
        {new Date().toLocaleDateString("sv-SE", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        })}
      </p>
    </div>
  );
};