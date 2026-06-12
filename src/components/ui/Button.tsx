type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function Button({
  children,
  onClick,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-1.5 rounded-xl bg-[#141414] border border-[#2A2A2A] text-[#00B7FF] font-medium transition-all duration-300 hover:text-[#33C7FF] hover:border-[#2ABEFF]/40 hover:shadow-[0_0_12px_rgba(0,183,255,0.12)] active:shadow-[0_0_30px_rgba(0,183,255,0.18)]"

      style={{
            textShadow: "0 0 8px rgba(0,183,255,0.5)",
          }}
    >
      {children}
    </button>
  );
}
