import { useMemo } from "react";
import { RequestInfo } from "@/types";
interface Props {
  rawRequestInfo: string;
}

const RequestInfoBadge = ({ rawRequestInfo }: Props) => {
  const requestInfo = useMemo(() => {
    return JSON.parse(rawRequestInfo) as RequestInfo;
  }, [rawRequestInfo]);

  return (
    <div className="p-2 rounded" style={{ backgroundColor: requestInfo.color }}>
      {requestInfo.name}
    </div>
  );
};

export default RequestInfoBadge;
