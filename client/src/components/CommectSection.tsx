import { Alert, Button, Modal, Textarea } from "flowbite-react";

import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comment from "./Comment";
import { HiOutlineExclamationCircle } from "react-icons/hi";

interface PostProps {
  postId: string;
}

function CommectSection({ postId }: PostProps) {
  const { currentUser } = useSelector((state: any) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState<any>();
  const [comments, setComments] = useState<any>([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<any>();

  const navigate = useNavigate();
  // console.log(comments);

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        const data = await res.json();
        if (res.ok) {
          setComments(data);
        } else {
          console.log(data?.message);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        } else {
          console.log("An error occurred");
        }
      }
    };
    getComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (comment.length > 200) {
        return null;
      }
      const res = await fetch(`/api/comment/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          content: comment,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment("");
        setCommentError(null);
        setComments([data, ...comments]);
      } else {
        setCommentError(data.message);
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setCommentError(error.message);
      } else {
        setCommentError("An error occured");
      }
    }
  };
  // console.log(commentError);
  const handleDelete = async (commentId: string) => {
    setShowModal(false);
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return null;
      }
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok) {
        setComments(
          comments.filter((comment: any) => comment._id !== commentId)
        );
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLike = useCallback(
    async (commentId: string) => {
      try {
        if (!currentUser) {
          navigate("/sign-in");
          return null;
        }
        const res = await fetch(
          `/api/comment/likeComment/${commentId}`,

          {
            credentials: "include",
            method: "PUT",
          }
        );
        const data = await res.json();
        if (res.ok) {
          setComments(
            comments.map((comment: any) =>
              comment._id === commentId
                ? {
                    ...comment,
                    likes: data.likes,
                    numberOfLikes: data.likes.length,
                  }
                : comment
            )
          );
        }
      } catch (error) {
        if (error instanceof Error) console.log(error.message);
      }
    },
    [comments, currentUser]
  );
  // console.log(comments);

  const handleEdit = useCallback(
    (comment: any, editedContent: string) => {
      setComments(
        comments.map((c: any) =>
          c._id === comment._id ? { ...c, content: editedContent } : c
        )
      );
    },
    [comments]
  );

  return (
    <div className="max-w-3xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-700 text-sm">
          <p>Signed in as: </p>
          <img
            className="w-9 h-9 rounded-full object-cover"
            src={currentUser.profilePicture}
            alt="profilePixture"
          />
          <Link
            className="text-sm text-cyan-600 hover:underline"
            to={"/dashboard?tab=profile"}
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-teal-500 my-5 flex gap-1">
          You must be signed in to comment.
          <Link className="text-blue-500 hover:underline" to={"/sign-in"}>
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className=" border border-teal-500 rounded-md p-3"
        >
          <Textarea
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setComment(e.target.value)
            }
            rows={3}
            value={comment}
            maxLength={200}
            placeholder="Add a comment.."
          />
          <div className="flex  justify-between items-center mt-5">
            <p className="text-gray-500 text-sm">
              {200 - comment.length} characters remaining
            </p>
            <Button outline gradientDuoTone={"purpleToBlue"} type="submit">
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color={"failure"} className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {comments.length === 0 ? (
        <p className="text-sm my-5">No comments yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment: any, index: number) => (
            <Comment
              key={index}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(commentId: string) => {
                setShowModal(true);
                setCommentToDelete(commentId);
              }}
            />
          ))}
        </>
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
              <Button
                color="failure"
                onClick={() => handleDelete(commentToDelete)}
              >
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

export default CommectSection;
