interface Props {
  onDismiss: () => void;
  children: React.ReactNode;
}

const Modal = ({ onDismiss, children }: Props) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onDismiss}
    >
      <div
        className="bg-background text-white rounded-lg p-4 border-4 border-layout-dark"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
