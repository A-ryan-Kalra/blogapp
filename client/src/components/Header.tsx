import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signOutSuccess } from "../redux/user/userSlice";

interface ReduxProps {
  user: {
    currentUser: null;
    error: null;
    loading: false;
  };
}
interface UserProps {
  createdAt: string;
  profilePicture: string;
  email: string;
  updatedAt: string;
  username: string;
  _id: string;
  __v: number;
}

function Header() {
  const location = useLocation();
  const dispatch = useDispatch();
  const searchParams = new URLSearchParams(location.search);
  const [searchTerm, setSearchTerm] = useState("");
  const path = location.pathname;
  const { theme } = useSelector((state: any) => state.theme);
  const navigate = useNavigate();

  const { currentUser }: { currentUser: UserProps | any } = useSelector(
    (state: ReduxProps) => state.user
  );
  // console.log(searchTerm);

  useEffect(() => {
    const searchTermFromUrl = searchParams.get("searchTerm");

    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignOut = useCallback(async () => {
    try {
      const res = await fetch(`/api/auth/signout`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An error occurred.");
      }
    }
  }, []);
  // console.log(currentUser.profilePicture, "currentUser.profilePicture");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    searchParams.set("searchTerm", searchTerm);
    const searchQuery = searchParams.toString();
    console.log(searchQuery);
    console.log("searchQuery");
    // navigate(`/search?${searchQuery}`);
    navigate(`/search?searchTerm=${searchTerm}`);
  };

  return (
    <Navbar className="border-b-2">
      <Link
        to={"/"}
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Aryan's
        </span>
        Blog
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
          placeholder="Search..."
          className="hidden lg:inline "
          rightIcon={AiOutlineSearch}
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" pill color="gray">
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-10  hidden sm:inline"
          pill
          color="gray"
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser ? (
          <Dropdown
            label={
              <Avatar alt="user" img={currentUser.profilePicture} rounded />
            }
            arrowIcon={false}
            inline
          >
            <Dropdown.Header className="text-left">
              <span className="block text-sm ">
                @
                {currentUser.username ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
              </span>
              <span className="block text-sm truncate font-medium">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to={"/sign-in"} className="">
            <Button gradientDuoTone={"purpleToBlue"} outline>
              Sign In
            </Button>
          </Link>
        )}

        <Navbar.Toggle></Navbar.Toggle>
      </div>
      <Navbar.Collapse color="" className="">
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to={"/"}>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to={"/about"}>About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to={"/projects"}>Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
