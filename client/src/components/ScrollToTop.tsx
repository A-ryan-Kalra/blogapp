import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  // console.log(pathname);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({
        behavior: "smooth",
        left: 0,
        top: 0,
      });
    }, 200);
    return () => clearTimeout(timer);
  }, [pathname]);
  return null;
};

export default ScrollToTop;
