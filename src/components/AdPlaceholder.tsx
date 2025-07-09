interface AdPlaceholderProps {
  type: "banner" | "sidebar" | "inline";
  className?: string;
}

export default function AdPlaceholder({
  type,
  className = "",
}: AdPlaceholderProps) {
  const getAdContent = () => {
    switch (type) {
      case "banner":
        return {
          width: "w-full",
          height: "h-20",
          text: "Banner Ad Space",
        };
      case "sidebar":
        return {
          width: "w-64",
          height: "h-96",
          text: "Sidebar Ad Space",
        };
      case "inline":
        return {
          width: "w-full",
          height: "h-32",
          text: "Inline Ad Space",
        };
      default:
        return {
          width: "w-full",
          height: "h-20",
          text: "Ad Space",
        };
    }
  };

  const { width, height, text } = getAdContent();

  return (
    <div className={`${width} ${height} ${className}`}>
      <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-sm font-medium">{text}</div>
          <div className="text-gray-400 text-xs mt-1">AdSense Ready</div>
        </div>
      </div>
    </div>
  );
}
