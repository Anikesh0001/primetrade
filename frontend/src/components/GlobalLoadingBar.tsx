import { useEffect, useState } from "react";
import { loadingStore } from "../services/loadingStore";

const GlobalLoadingBar = () => {
  const [active, setActive] = useState(loadingStore.get());

  useEffect(() => {
    return loadingStore.subscribe(setActive);
  }, []);

  return (
    <div
      className={`fixed left-0 top-0 z-50 h-1 w-full bg-indigo-500 transition-opacity ${
        active ? "opacity-100" : "opacity-0"
      }`}
    />
  );
};

export default GlobalLoadingBar;
