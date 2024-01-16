import { useUserData } from "../helpers/useUserData";
import { relativeDate } from "../helpers/relativeDate";

export const Comment = ({ comment, createdBy, createdDate }) => {
  const createdUser = useUserData(createdBy);
  if (createdUser.isLoading)
    return (
      <div className="comment">
        <div className="comment-header">Loading...</div>
      </div>
    );
  return (
    <div className="comment">
      <img src={createdUser.data?.profilePictureUrl} alt="Commenter Avatar" />
      <div>
        <div className="comment-header">
          <span>{createdUser.data?.name}</span> commented{" "}
          <span>{relativeDate(createdDate)}</span>
        </div>
        <div className="comment-body">{comment}</div>
      </div>
    </div>
  );
};
