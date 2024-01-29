import React, { useRef, useEffect } from "react";

const ExampleComponent = () => {
  const inputRef = useRef(0);

  useEffect(() => {
    // Focus on the input element when the component mounts
    // inputRef.current.focus();
  }, []);
  const handleclick = (e) => {
    e.preventDefault();
    console.log(inputRef.current);
  };

  return (
    <div>
      <input ref={inputRef} type="number" />
      <button
        onClick={handleclick}
        className="h-10 w-10 bg-fuchsia-500"
      ></button>
    </div>
  );
};
export default ExampleComponent;
