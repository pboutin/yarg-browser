import Icon from "@/components/icon";
import Modal from "@/components/modal";
import { useState } from "react";
import QRCode from "react-qr-code";

const ShareButton = () => {
  const [qrCodeModalOpened, setQrCodeModalOpened] = useState(false);

  return (
    <>
      <button
        type="button"
        className="fixed bottom-4 right-4 bg-primary text-background p-4 rounded-full z-20 transition-all duration-300 hover:bg-secondary cursor-pointer"
        onClick={() => setQrCodeModalOpened(true)}
      >
        <Icon icon="qr" size={32} />
      </button>

      {qrCodeModalOpened && (
        <Modal onDismiss={() => setQrCodeModalOpened(false)}>
          <div className="bg-white rounded-lg p-4">
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={location.origin}
              viewBox={`0 0 256 256`}
            />
          </div>
          <div className="text-center text-sm text-secondary mt-4">
            {location.origin}
          </div>
        </Modal>
      )}
    </>
  );
};

export default ShareButton;
