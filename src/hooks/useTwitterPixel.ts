export const useTwitterPixel = () => {
  const trackTwitterEvent = () => {
    if (typeof window !== "undefined" && (window as any).twq) {
      (window as any).twq("event", "tw-q7q77-q7q77", {});
    }
  };

  return { trackTwitterEvent };
};
