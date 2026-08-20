import Icon, { IconName } from "@/components/icon";

interface Props {
  label: string;
  icon?: IconName;
  onClick: () => void;
}

const Button = ({ label, icon, onClick }: Props) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-2 mt-4 bg-layout-light text-white px-4 py-2 rounded-md w-full cursor-pointer hover:bg-layout-dark transition-all duration-300"
    >
      {icon ? <Icon icon={icon} size={16} /> : null}
      {label}
    </button>
  );
};

export default Button;
