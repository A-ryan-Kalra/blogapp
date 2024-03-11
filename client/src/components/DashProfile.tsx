import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Alert, Button, Modal, TextInput } from "flowbite-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  deleteFailure,
  deleteStart,
  deleteSuccess,
  signOutSuccess,
  updateFailure,
  updateStart,
  updateSuccess,
} from "../redux/user/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

function DashProfile() {
  const { currentUser, error, loading } = useSelector(
    (state: any) => state.user
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imgFileUrl, setImgFileUrl] = useState<string | null>(null);
  const filePickerRef = useRef<HTMLInputElement>(null);
  const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState<
    string | null
  >(null);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [num, setNum] = useState(0);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState<any>(null);
  const [updateUserError, setUpdateUserError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleImageFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUpdateUserSuccess("");
      const file = e.target.files?.[0];
      if (file) {
        setImageFile(file);
        setImgFileUrl(URL.createObjectURL(file));
      }
    },
    []
  );

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = useCallback(async () => {
    setImageFileUploading(true);
    setImageUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile?.name!;

    const storageRef = ref(storage, `images/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile as Blob);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadingProgress(progress.toFixed(0));
        setNum(100);
      },
      (error) => {
        setImageUploadError(
          ("Could not upload (File must be less than 2MB) " +
            error.message) as string
        );
        setNum(0);
        setImageFileUploadingProgress(null);
        setImageFile(null);
        setImgFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImgFileUrl(downloadUrl);
          setFormData({ ...formData, profilePicture: downloadUrl });
          setImageFileUploading(false);
        });
      }
    );
  }, [imageFile, formData]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUpdateUserSuccess("");
      setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    },
    [formData]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setUpdateUserError("");

      if (imageFileUploading) {
        setUpdateUserError("Please wait for the image to upload");
        return null;
      }
      if (Object.keys(formData).length === 0) {
        setUpdateUserError("No changes made");
        return;
      }

      try {
        dispatch(updateStart());
        const res = await fetch(`/api/user/update/${currentUser._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data: any = await res.json();

        if (!res.ok) {
          dispatch(updateFailure(data.message));
          setUpdateUserError(data.message);
        } else {
          dispatch(updateSuccess(data));
          setUpdateUserSuccess("User's profile updated successfully");
          setUpdateUserError("");
        }
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          dispatch(updateFailure(error.message));
        } else {
          dispatch(updateFailure("An error occured."));
        }
      } finally {
        setFormData({});
      }
    },
    [formData, currentUser._id, imageFileUploading]
  );

  const handleDeleteUser = useCallback(async () => {
    setShowModal(false);
    try {
      dispatch(deleteStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteFailure(data?.message));
      } else {
        dispatch(deleteSuccess(data));
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        dispatch(deleteFailure(error.message));
      } else {
        dispatch(deleteFailure("An error occurred"));
      }
    }
  }, [currentUser._id]);

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

  // console.log(formData);
  return (
    <div className="w-full max-w-lg mx-auto p-3">
      <h1 className="text-center my-7 font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex w-full gap-4 flex-col">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageFile}
          ref={filePickerRef}
          value={""}
          hidden
        />
        <div className="w-32 h-32 self-center cursor-pointer shadow-md rounded-full overflow-hidden relative">
          {imageFileUploadingProgress && (
            <CircularProgressbar
              value={(imageFileUploadingProgress as unknown as number) || 0}
              text={`${imageFileUploadingProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },

                path: {
                  stroke: `rgba(81,187,199,${
                    (imageFileUploadingProgress as unknown as number) / 100
                  }`,
                },
              }}
            />
          )}
          <img
            src={imgFileUrl || currentUser?.profilePicture}
            alt="profile"
            className={`  rounded-full w-full h-full border-8 border-[lightgray] object-cover  duration-[1s] transition-all ease-out`}
            style={{
              filter: `blur(${
                num - (imageFileUploadingProgress as unknown as number)
              }px)`,
            }}
            onClick={() => filePickerRef.current?.click()}
          />
        </div>
        {imageUploadError && (
          <Alert color={"failure"}>{imageUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          onChange={handleChange}
          defaultValue={currentUser?.username}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          onChange={handleChange}
          defaultValue={currentUser?.email}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <Button
          type="submit"
          // disabled={Object.keys(formData).length === 0}
          className=" disabled:cursor-not-allowed"
          outline
          disabled={loading || imageFileUploading}
          gradientDuoTone={"purpleToBlue"}
        >
          {loading ? "Loading..." : "Update"}
        </Button>
        {currentUser?.isAdmin && (
          <Link to={"/create-post"}>
            <Button
              type="button"
              gradientDuoTone={"purpleToPink"}
              className="w-full"
            >
              Create a post
            </Button>
          </Link>
        )}
      </form>
      <div className="text-red-500 flex justify-between items-center mt-5">
        <span
          onClick={() => setShowModal(true)}
          className="cursor-pointer hover:underline"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignOut}
          className="cursor-pointer hover:underline"
        >
          Sign out
        </span>
      </div>
      {updateUserSuccess && (
        <Alert color={"success"} className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color={"failure"} className="mt-5">
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color={"failure"} className="mt-5">
          {error}
        </Alert>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size={"md"}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className=" flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DashProfile;
