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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect width="5" height="5" x="3" y="3" rx="1" />
          <rect width="5" height="5" x="16" y="3" rx="1" />
          <rect width="5" height="5" x="3" y="16" rx="1" />
          <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
          <path d="M21 21v.01" />
          <path d="M12 7v3a2 2 0 0 1-2 2H7" />
          <path d="M3 12h.01" />
          <path d="M12 3h.01" />
          <path d="M12 16v.01" />
          <path d="M16 12h1" />
          <path d="M21 12v.01" />
          <path d="M12 21v-1" />
        </svg>
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
