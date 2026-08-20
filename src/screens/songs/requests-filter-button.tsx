import Button from "@/components/button";
import { useState } from "react";
import { useEffect } from "react";

interface Props {
  countSongRequests: () => Promise<number>;
  onClick: () => void;
}

const RequestsFilterButton = ({ countSongRequests, onClick }: Props) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      countSongRequests().then(setCount);
    }, 1000);

    return () => clearInterval(id);
  }, [countSongRequests]);

  return (
    <Button
      label={count ? `Requests (${count})` : "No requests"}
      icon="music"
      onClick={onClick}
    />
  );
};

export default RequestsFilterButton;
