function DotIndicators({
  count,
  currentIndex,
  onDotClick,
  activeClass = "bg-green-500",
  inactiveClass = "border-gray-400",
}) {
  return (
    <div className="flex justify-center items-center">
      {Array.from({ length: count }).map((_, index) => (
        <span
          key={index}
          onClick={() => onDotClick(index)}
          className={`w-5 h-5 rounded-full m-2 border-2 cursor-pointer transition-all duration-300 ${
            currentIndex === index ? activeClass : inactiveClass
          }`}
        ></span>
      ))}
    </div>
  );
}

export default DotIndicators;
