import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Oauth from "../components/Oauth";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";

interface SignUpProps {
  username: string;
  password: string;
  email: string;
}

function SignUp() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<SignUpProps>();
  const [errorMessage, setErrorMessage] = useState<any>();
  const [loading, setLOading] = useState(false);
  const navigate = useNavigate();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();

      setFormData({
        ...formData,
        [e.target.id]: e.target.value.trim(),
      } as SignUpProps);
    },
    [formData]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!formData?.username || !formData.email || !formData.password) {
        return setErrorMessage("Please fill out the details" as string);
      }
      try {
        setLOading(true);
        setErrorMessage(null);
        const res = await fetch(`/api/auth/signup`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }).then((res) => res.json());

        if (res?.success === false) {
          setErrorMessage(res?.message);
        } else {
          dispatch(signInSuccess(res));
          navigate("/");
        }
        setLOading(false);

        setFormData({} as SignUpProps);
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          setErrorMessage(error?.message);
        } else {
          setErrorMessage("An error occured");
        }
        setLOading(false);
      }
    },
    [formData, navigate]
  );
  // console.log(formData);
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <div className="cursor-default text-4xl font-bold dark:text-white">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Aryan's
            </span>
            Blog
          </div>
          <p className="text-sm mt-5 ">
            This is a demo project. You can sign up with your email and password
            ord with Google.
          </p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="">
              <Label value="Your username" />
              <TextInput
                type="text"
                placeholder="Username"
                value={formData?.username || ""}
                onChange={handleChange}
                id="username"
              />
            </div>
            <div className="">
              <Label value="Your email" />
              <TextInput
                type="text"
                placeholder="abc@xyz.com"
                value={formData?.email || ""}
                onChange={handleChange}
                id="email"
              />
            </div>
            <div className="">
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="**********"
                value={formData?.password || ""}
                onChange={handleChange}
                id="password"
              />
            </div>
            <Button
              gradientDuoTone={"purpleToPink"}
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <>
                  <Spinner size={"sm"} />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign up"
              )}
            </Button>
            <Oauth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Do you have an account?</span>
            <Link to={"/sign-in"} className="text-blue-500">
              Sign In
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color={"failure"}>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignUp;
