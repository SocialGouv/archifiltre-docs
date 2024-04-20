import React, { useEffect, useState } from "react";

const LoadingDots: React.FC = () => {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length === 3) {
          return ".";
        } else {
          return `${prevDots}.`;
        }
      });
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <div>{dots}</div>;
};

export default LoadingDots;
