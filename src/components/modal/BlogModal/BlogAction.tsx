import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { IoMdShareAlt } from "react-icons/io";
import { GoComment } from "react-icons/go";
import { useState } from "react";
import ShareOption from "./ShareOption";

interface BlogActionsProps {
  isLiked: boolean;
  likesCount: number;
  commentsCount: number;
  onLike: () => void;
  onToggleComment: () => void;
  onToggleCommentsList: () => void;
  blogUrl: string; 
}

const BlogActions: React.FC<BlogActionsProps> = ({
  isLiked,
  likesCount,
  commentsCount,
  onLike,
  onToggleComment,
  onToggleCommentsList,
  blogUrl,
}) => {
  const [showShareOptions, setShowShareOptions] = useState(false);



  return (
    <div className="flex justify-between mt-2">
      <div className="flex space-x-5">
        {/* Like */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={onLike}
        >
          {isLiked ? (
            <AiFillLike className="text-2xl" />
          ) : (
            <AiOutlineLike className="text-2xl text-gray-700" />
          )}
          <p className="text-sm font-medium">{isLiked ? "Unlike" : "Like"}</p>
        </div>

        {/* Comment */}
        <div
          className="flex space-x-1 cursor-pointer"
          onClick={onToggleComment}
        >
          <GoComment className="text-2xl" />
          <p>Comment</p>
        </div>

        {/* Share */}
        <div className="relative">
          <div
            className="flex space-x-1 cursor-pointer"
            onClick={() => setShowShareOptions(!showShareOptions)}
          >
            <IoMdShareAlt className="text-2xl" />
            <p>Share</p>
          </div>

          {showShareOptions && (
            <ShareOption blogUrl = {blogUrl} onClose={() => setShowShareOptions(false)}/>
          )}
        </div>
      </div>

      <div className="flex space-x-6">
        <div>{likesCount || 0} Likes</div>
        <div className="cursor-pointer" onClick={onToggleCommentsList}>
          {commentsCount || 0} Comments
        </div>
      </div>
    </div>
  );
};

export default BlogActions;
