interface RoastMessageProps {
  roast: string;
  title: string;
}

export default function RoastMessage({ roast, title }: RoastMessageProps) {
  return (
    <div className="relative">
      <div className="absolute -left-4 top-0 text-6xl text-purple-500/20 font-serif">
        "
      </div>
      <div className="pl-8 pr-4">
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-lg text-gray-300 italic leading-relaxed">{roast}</p>
      </div>
      <div className="absolute -right-4 bottom-0 text-6xl text-purple-500/20 font-serif">
        "
      </div>
    </div>
  );
}
