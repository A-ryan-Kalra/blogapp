import { prodErrorMap } from "firebase/auth";
import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommectSection from "../components/CommectSection";
import PostCard from "../components/PostCard";

function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(false);
  const [post, setPost] = useState<any>();
  const [recentPost, setRecentPost] = useState<any>();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setLoading(false);
          return null;
        } else {
          setPost(data.posts[0]);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error(prodErrorMap);
      }
    };
    fetchPost();
  }, [postSlug]);
  console.log(post);
  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(`/api/post/getposts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPost(data.posts);
        }
      };
      fetchRecentPosts();
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size={"xl"} />
      </div>
    );
  }
  //   console.log(post.content);
  return (
    <main className="p-3 flex flex-col max-w-6xl  mx-auto min-h-screen ">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post && post?.title}
      </h1>
      <Link
        className="self-center mt-5"
        to={`/search?category=${post?.category}`}
      >
        <Button color="gray" pill size={"xs"} className="">
          {post && post.category}
        </Button>
      </Link>
      <img
        src={post.image}
        alt={post.title}
        className="mt-10 p-3 border shadow-md overflow-hidden shadow-teal-200 max-h-[500px] w-full object-cover"
      />
      <div className="flex justify-between px-3 my-2 border-b border-slate-500 mx-auto w-full  max-w-3xl">
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        <span>{(post.content.length / 1000).toFixed(0)} mins read</span>
      </div>
      <div
        className="p-3 max-w-3xl overflow-hidden flex-wrap mx-auto break-words w-full post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
      <CommectSection postId={post._id} />
      <div className="flex flex-col justify-center items-center mb-5 w-full ">
        <h1 className="text-xl mt-5">Recent articles</h1>
        <div className="flex flex-wrap gap-5 mt-5 justify-center ">
          {recentPost &&
            recentPost.map((post: any) => (
              <PostCard key={post._id} post={post} />
            ))}
        </div>
      </div>
    </main>
  );
}

export default PostPage;
