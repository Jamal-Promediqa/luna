export const getVariantForStatus = (status: string) => {
  switch (status.toLowerCase()) {
    case "brådskande":
      return "destructive";
    case "pågående":
      return "default";
    case "väntar":
      return "secondary";
    case "klar":
      return "outline";
    default:
      return "default";
  }
};