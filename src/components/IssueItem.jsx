import { Link } from "react-router-dom";
import { GoIssueOpened, GoIssueClosed, GoComment } from "react-icons/go";
import { relativeDate } from "../helpers/relativeDate";
import { useUserData } from "../helpers/useUserData";
import { useQueryClient } from "@tanstack/react-query";
import fetchWithError from "../helpers/fetchWithError";

const Label = ({ label, labelsData }) => {
  const { data, isLoading } = labelsData;

  if (isLoading) return null;

  const labelObj = data.find((queryLabel) => queryLabel.id === label);
  if (!labelObj) return null;
  return <span className={`label ${labelObj.color}`}>{labelObj.name}</span>;
};
export const IssueItem = ({
  title,
  number,
  assignee,
  commentCount,
  createdBy,
  createdDate,
  labels,
  status,
  labelsData,
}) => {
  const { data: assigneeUserData, isSuccess: assigneeUserSuccess } =
    useUserData(assignee);
  const { data: createdByUserData, isSuccess: createdByUserSuccess } =
    useUserData(createdBy);
  const queryClient = useQueryClient();

  return (
    <li
      onMouseEnter={() => {
        queryClient.prefetchQuery({
          queryKey: ["issues", number.toString()],
          queryFn: () => fetchWithError(`/api/issues/${number}`),
        });
        queryClient.prefetchQuery({
          queryKey: ["issues", number.toString(), "comments"],
          queryFn: () => fetchWithError(`/api/issues/${number}/comments`),
        });
      }}
    >
      <div>
        {status === "done" || status === "cancelled" ? (
          <GoIssueClosed style={{ color: "red" }} />
        ) : (
          <GoIssueOpened style={{ color: "green" }} />
        )}
      </div>
      <div className="issue-content">
        <span>
          <Link to={`/issue/${number}`}>{title}</Link>
          {labels.map((label) => (
            <Label key={label} label={label} labelsData={labelsData} />
          ))}
        </span>
        <small>
          #{number} opened {relativeDate(createdDate)}{" "}
          {createdByUserSuccess ? `by ${createdByUserData.name}` : null}
        </small>
      </div>
      {assigneeUserSuccess &&
        assigneeUserData &&
        assigneeUserData.profilePictureUrl && (
          <img
            src={assigneeUserData.profilePictureUrl}
            className="assigned-to"
            alt={`Assigned to ${assigneeUserData.name}`}
          />
        )}
      <span className="comment-count">
        {commentCount > 0 && (
          <>
            <GoComment />
            {commentCount}
          </>
        )}
      </span>
    </li>
  );
};
