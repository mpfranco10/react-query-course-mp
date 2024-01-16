import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { IssueHeader } from "./IssueHeader";
import { Comment } from "./Comment";

function useIssueData(issueNumber) {
  return useQuery(["issues", issueNumber], () => {
    return fetch(`/api/issues/${issueNumber}`).then((res) => res.json());
  });
}

function useIssueComments(issueNumber) {
  return useQuery(["issues", issueNumber, "comments"], () => {
    return fetch(`/api/issues/${issueNumber}/comments`).then((res) =>
      res.json()
    );
  });
}

export default function IssueDetails() {
  const { number } = useParams();
  const { isLoading, data } = useIssueData(number);
  const commentsQuery = useIssueComments(number);

  return (
    <div className="issue-details">
      {isLoading ? (
        <p>Loading issue...</p>
      ) : (
        <>
          <IssueHeader {...data} />

          <main>
            <section>
              {commentsQuery.isLoading ? (
                <p>Loading...</p>
              ) : (
                commentsQuery.data?.map((comment) => (
                  <Comment key={comment.id} {...comment} />
                ))
              )}
            </section>
            <aside></aside>
          </main>
        </>
      )}
    </div>
  );
}
