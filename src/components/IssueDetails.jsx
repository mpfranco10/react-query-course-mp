import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { IssueHeader } from "./IssueHeader";
import { Comment } from "./Comment";

function useIssueData(issueNumber) {
  return useQuery({
    queryKey: ["issues", issueNumber],
    queryFn: async () => {
      const res = await fetch(`/api/issues/${issueNumber}`);
      return await res.json();
    },
  });
}

function useIssueComments(issueNumber) {
  return useQuery({
    queryKey: ["issues", issueNumber, "comments"],
    queryFn: async () => {
      const res = await fetch(`/api/issues/${issueNumber}/comments`);
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
            <aside></aside>
          </main>
        </>
      )}
    </div>
  );
}
