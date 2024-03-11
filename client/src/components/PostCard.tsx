import { Link } from "react-router-dom";

interface PostCardProps {
  post: any;
}

function PostCard({ post }: PostCardProps) {
  return (
    <div className="group relative w-full border border-teal-500 hover:border-2 rounded-md  transition-all overflow-hidden h-[400px] sm:w-[430px]">
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt="image"
          className="h-[240px] group-hover:h-[200px] transition-all z-20 duration-[0.4s] w-full object-cover"
        />
      </Link>
      <div className="p-3 flex flex-col gap-2">
        <p className="text-lg font-semibold line-clamp-1 group-hover:line-clamp-none">
          {post.title}
        </p>
        <span className="italic text-sm">{post.category}</span>
        <Link
          className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2"
          to={`/post/${post.slug}`}
        >
          Read article
        </Link>
      </div>
    </div>
  );
}

export default PostCard;
