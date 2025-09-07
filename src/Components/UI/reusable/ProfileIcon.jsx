function ProfileIcon() {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex justify-center items-center shadow-lg hover:scale-125 transition-transform duration-300 cursor-pointer">
        <svg
          width="25"
          height="25"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-pulse"
        >
          <circle cx="12" cy="7" r="4" />
          <path d="M5.5 21c0-3.6 3-6.5 6.5-6.5s6.5 2.9 6.5 6.5" />
        </svg>
      </div>
    </div>
  );
}

export default ProfileIcon;
