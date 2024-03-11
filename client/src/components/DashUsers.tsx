import { Button, Modal, Table } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";

function DashUsers() {
  const { currentUser } = useSelector((state: any) => state.user);
  const [user, setUser] = useState<Object[]>([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`, {
          credentials: "include",
        });
        const data = await res.json();
        // console.log(data);
        if (res.ok) {
          setUser(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleShowMore = useCallback(async () => {
    const startIndex = user?.length;

    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`, {
        credentials: "include",
      });
      const data = await res.json();
      // console.log(data?.post?.length);
      if (res.ok) {
        setUser((prev) => [...prev, ...data?.users]);
        if (data?.users?.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, [user.length, currentUser._id]);

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        console.error(data.message);
      } else {
        setUser((prev) =>
          prev.filter((prev: any) => prev._id !== userIdToDelete)
        );
      }
    } catch (error) {
      console.error(error);
    }
  };
  // console.log(user);
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-200 scrollbar-thumb-fuchsia-400 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 ">
      {currentUser.isAdmin && user.length > 0 ? (
        <div className="">
          <Table hoverable className="shadow-md w-screen max-w-[1300px]">
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y ">
              {user.map((user: any, index: number) => (
                <Table.Row
                  key={index}
                  className="bg-white  divide-x dark:border-gray-700 dark:bg-gray-700"
                >
                  <Table.Cell>
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell className="">
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-14 rounded-full h-14 object-cover bg-gray-500"
                    />
                  </Table.Cell>
                  <Table.Cell className="max-w-[500px]">
                    {user.username}
                  </Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setUserIdToDelete(user._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <button
              className="w-full text-teal-500 self-center text-sm py-7"
              onClick={handleShowMore}
            >
              Show more
            </button>
          )}
        </div>
      ) : (
        <p>You have no users yet.</p>
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
              Are you sure you want to delete this post?
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

export default DashUsers;
