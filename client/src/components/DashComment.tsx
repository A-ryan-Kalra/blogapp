import { Button, Modal, Table } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";

function DashComments() {
  const { currentUser } = useSelector((state: any) => state.user);
  const [user, setUser] = useState<Object[]>([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/comment/getcomments`, {
          credentials: "include",
        });
        const data = await res.json();
        // console.log(data);
        if (res.ok) {
          setUser(data.comments);
          if (data.comments.length < 9) {
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
      const res = await fetch(
        `/api/comment/getcomments?startIndex=${startIndex}`
      );
      const data = await res.json();
      // console.log(data?.post?.length);
      if (res.ok) {
        setUser((prev) => [...prev, ...data?.comments]);
        if (data?.comments?.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, [user.length, currentUser._id]);
  // console.log(user);
  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/comment/deleteComment/${userIdToDelete}`, {
        method: "DELETE",
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
      if (error instanceof Error) console.error(error);
    }
  };
  // console.log(user);
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-200 scrollbar-thumb-fuchsia-400 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 ">
      {currentUser.isAdmin && user.length > 0 ? (
        <div className="">
          <Table hoverable className="shadow-md w-screen max-w-[1300px]">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>NUmber of Likes</Table.HeadCell>
              <Table.HeadCell>PostId</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y ">
              {user.map((user: any, index: number) => (
                <Table.Row
                  key={index}
                  className="bg-white   divide-x dark:border-gray-700 dark:bg-gray-700"
                >
                  <Table.Cell>
                    {new Date(user?.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell className="">{user.content}</Table.Cell>
                  <Table.Cell className="max-w-[500px]">
                    {user.numberOfLikes}
                  </Table.Cell>
                  <Table.Cell>{user.postId}</Table.Cell>
                  <Table.Cell>{user.userId}</Table.Cell>
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
        <p>You have no comments yet.</p>
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
              Are you sure you want to delete this comment?
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

export default DashComments;
