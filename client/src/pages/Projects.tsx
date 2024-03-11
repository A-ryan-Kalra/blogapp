import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Projects() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/search");
  }, [location.search]);
  return null;
}

export default Projects;
