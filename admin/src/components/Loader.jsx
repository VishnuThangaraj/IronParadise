export const Loader = () => {
  const spinnerStyle = {
    fontSize: "28px",
    position: "relative",
    display: "inline-block",
    width: "1em",
    height: "1em",
  };

  const centerStyle = {
    position: "absolute",
    left: "0",
    right: "0",
    top: "0",
    bottom: "0",
    margin: "auto",
  };

  const bladeStyle = {
    position: "absolute",
    left: "0.4629em",
    bottom: "0",
    width: "0.074em",
    height: "0.2777em",
    borderRadius: "0.0555em",
    backgroundColor: "transparent",
    transformOrigin: "center -0.2222em",
    animation: "spinner-fade9234 1s infinite linear",
  };

  const blades = Array.from({ length: 12 }).map((_, index) => {
    const rotation = `${index * 30}deg`;
    const animationDelay = `${index * 0.083}s`;

    return (
      <div
        key={index}
        style={{
          ...bladeStyle,
          transform: `rotate(${rotation})`,
          animationDelay: animationDelay,
        }}
      />
    );
  });

  return (
    <div style={{ ...spinnerStyle, ...centerStyle }}>
      {blades}
      <style>
        {`
          @keyframes spinner-fade9234 {
            0% {
              background-color: #69717d;
            }
            100% {
              background-color: transparent;
            }
          }
        `}
      </style>
    </div>
  );
};