type CardProps = {
  title: string;
  value: string | number;
  bgColor: string;
  borderColor: string;
};

export default function Card({
  title,
  value,
  bgColor,
  borderColor,
}: CardProps) {
  return (
    <div
      className="rounded-2xl border p-6 min-h-[120px] transition-all duration-300"
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
      }}
    >
      <p className="text-sm text-gray-300 mb-3">
        {title}
      </p>

      <h2 className="text-4xl font-bold">
        {value}
      </h2>
    </div>
  );
}