import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

function OnlyAdminPrivateRoute() {
  const { currentUser } = useSelector((state: any) => state.user);

  //   console.log(currentUser.isAdmin, "currentUser.isAdmin");

  return currentUser?.isAdmin ? <Outlet /> : <Navigate to={"/sign-in"} />;
}

export default OnlyAdminPrivateRoute;
