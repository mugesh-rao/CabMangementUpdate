import React, { useState, useEffect } from 'react';
import { ThreeCircles } from 'react-loader-spinner'
const Loading = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    loading && (
      <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="relative">
          <ThreeCircles
            height="100"
            width="100"
            color="#00adb5"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="three-circles-rotating"
            outerCircleColor="#00adb5"
            innerCircleColor="#222831"
            middleCircleColor="#393e46"
          />
        </div>
      </div>
    )
  );
};

export default Loading;
