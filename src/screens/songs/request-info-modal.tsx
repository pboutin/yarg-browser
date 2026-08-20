import Button from "@/components/button";
import Modal from "@/components/modal";
import { RequestInfo } from "@/types";
import { useState } from "react";
interface Props {
  requestInfo: RequestInfo | null;

  onClose: () => void;
  onChange: (requestInfo: RequestInfo) => void;
}

const RequestInfoModal = ({ requestInfo, onClose, onChange }: Props) => {
  const [stagedRequestInfo, setStagedRequestInfo] = useState<RequestInfo>(
    requestInfo ?? { name: "", color: "" }
  );

  return (
    <Modal onDismiss={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={stagedRequestInfo?.name}
            className="bg-white text-black px-4 py-2 rounded-md outline-none border-4 border-layout-light w-full"
            onChange={(e) =>
              setStagedRequestInfo({
                name: e.target.value,
                color: stagedRequestInfo?.color ?? "",
              })
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="color">Color</label>
          <input
            type="color"
            id="color"
            value={stagedRequestInfo?.color}
            className="bg-white text-black rounded-md outline-none border-4 border-layout-light w-full h-12"
            onChange={(e) =>
              setStagedRequestInfo({
                name: stagedRequestInfo?.name ?? "",
                color: e.target.value,
              })
            }
          />
        </div>

        <Button
          label="Save"
          icon="save"
          onClick={() => onChange(stagedRequestInfo)}
        />
      </div>
    </Modal>
  );
};

export default RequestInfoModal;
