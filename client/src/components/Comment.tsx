import { Button, Textarea } from "flowbite-react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";

interface CommentProps {
  comment: any;
  onLike: (commentId: string) => Promise<null | undefined>;
  onEdit: (comment: any, editedContent: string) => void;
  onDelete: (commentId: string) => void;
}

function Comment({ comment, onLike, onEdit, onDelete }: CommentProps) {
  const { currentUser } = useSelector((state: any) => state.user);
  const [user, setUser] = useState<any>({});
  const [editComment, setEditComment] = useState(comment.content);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editComment,
        }),
      });

      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editComment);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getUsers();
  }, [comment]);
  // console.log(comment);

  const handleEdit = () => {
    setIsEditing(true);
    setEditComment(comment.content);
  };

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          src={user.profilePicture}
          className="w-10 h-10 rounded-full bg-gray-200"
          alt="user"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 twxt-sm truncate">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className="mb-2 resize-none"
              // rows={3}
              value={editComment}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setEditComment(e.target.value)
              }
            />
            <div className="flex justify-end gap-2 text-xs">
              <Button
                className=""
                size={"sm"}
                gradientDuoTone={"purpleToBlue"}
                onClick={handleSave}
                type="button"
              >
                Save
              </Button>
              <Button
                className=""
                size={"sm"}
                gradientDuoTone={"purpleToBlue"}
                type="button"
                outline
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-2">{comment.content}</p>
            <div className="flex items-center pt-2 text-sm border-t dark:border-gray-700 max-w-fit gap-2">
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="text-gray-400">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "Like" : "Likes")}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="text-gray-400 hover:text-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(comment._id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default React.memo(Comment);
