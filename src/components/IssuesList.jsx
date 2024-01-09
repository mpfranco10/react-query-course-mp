import { useQuery } from "react-query";
import { IssueItem } from "./IssueItem";

export default function IssuesList({ labelsData, labels }) {
  const { isLoading, data } = useQuery(["issues", { labels }], () => {
    const labelsString = labels.map((label) => `labels[]=${label}`).join("&");
    return fetch(`/api/issues?${labelsString}`).then((res) => res.json());
  });
  return (
    <div>
      <h1>Issues List</h1>
      {isLoading ? (
        <p>Loading....</p>
      ) : (
        <ul className="issues-list">
          {data.map((issue) => (
            <IssueItem
              labelsData={labelsData}
              key={issue.id}
              title={issue.title}
              number={issue.number}
              assignee={issue.assignee}
              commentCount={issue.comments.length}
              createdBy={issue.createdBy}
              createdDate={issue.createdDate}
              labels={issue.labels}
              status={issue.status}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
