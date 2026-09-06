export const isLocalhost = () => {
  if (typeof window === "undefined") return false;
  return window?.location?.hostname === "localhost";
};
