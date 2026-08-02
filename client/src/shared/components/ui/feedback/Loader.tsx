const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 dark:bg-slate-950/40 backdrop-blur-md transition-colors duration-300">
      <style>
        {`
          @keyframes spinner-fade {
            0% { background-color: currentColor; }
            100% { background-color: transparent; }
          }
        `}
      </style>
      <div className="relative inline-block text-[44px] w-[1em] h-[1em]">
        <div className="absolute inset-0 m-auto">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-[0.4629em] bottom-0 w-[0.074em] h-[0.2777em] rounded-[0.0555em] bg-transparent text-indigo-600 dark:text-indigo-400"
              style={{
                transformOrigin: "center -0.2222em",
                animation: "spinner-fade 1s infinite linear",
                animationDelay: `${i * 0.083}s`,
                transform: `rotate(${i * 30}deg)`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loader;
