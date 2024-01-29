import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { IssueHeader } from "./IssueHeader";
import { Comment } from "./Comment";
import IssueStatus from "./IssueStatus";
import IssueAssignment from "./IssueAssignment";
import IssueLabels from "./IssueLabels";

function useIssueData(issueNumber) {
  return useQuery({
    queryKey: ["issues", issueNumber],
    queryFn: async ({ signal }) => {
      const res = await fetch(`/api/issues/${issueNumber}`, { signal });
      return await res.json();
    },
  });
}

function useIssueComments(issueNumber) {
  return useQuery({
    queryKey: ["issues", issueNumber, "comments"],
    queryFn: async ({ signal }) => {
      const res = await fetch(`/api/issues/${issueNumber}/comments`, {
        signal,
      });
      return await res.json();
    },
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
            <aside>
              <IssueStatus
                status={data?.status}
                issueNumber={data?.number.toString()}
              />
              <IssueAssignment
                assignee={data?.assignee?.toString()}
                issueNumber={data?.number.toString()}
              />
              <IssueLabels
                labels={data?.labels}
                issueNumber={data?.number.toString()}
              />
            </aside>
          </main>
        </>
      )}
    </div>
  );
}
