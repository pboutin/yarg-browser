import Icon from "@/components/icon";

interface Props {
  onClick: () => void;
  hasRequestInfo: boolean;
}

const RequestInfoButton = ({ onClick, hasRequestInfo }: Props) => {
  return (
    <>
      <button
        type="button"
        className="fixed bottom-4 right-24 bg-primary text-background p-4 rounded-full z-20 transition-all duration-300 hover:bg-secondary cursor-pointer"
        onClick={onClick}
      >
        {hasRequestInfo ? <Icon icon="userYes" /> : <Icon icon="userNo" />}
      </button>
    </>
  );
};

export default RequestInfoButton;
