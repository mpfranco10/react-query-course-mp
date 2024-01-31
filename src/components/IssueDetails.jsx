import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { IssueHeader } from "./IssueHeader";
import { Comment } from "./Comment";
import IssueStatus from "./IssueStatus";
import IssueAssignment from "./IssueAssignment";
import IssueLabels from "./IssueLabels";
import Loader from "./Loader";
import useScrollToBottomAction from "../helpers/useScrollToBottomAction";

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
  return useInfiniteQuery({
    queryKey: ["issues", issueNumber, "comments"],
    queryFn: async ({ signal, pageParam = 1 }) => {
      const res = await fetch(
        `/api/issues/${issueNumber}/comments?page=${pageParam}`,
        {
          signal,
        },
      );
      return await res.json();
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage?.length === 0) return;
      return pages?.length + 1;
    },
  });
}

export default function IssueDetails() {
  const { number } = useParams();
  const { isLoading, data } = useIssueData(number);
  const commentsQuery = useIssueComments(number);

  useScrollToBottomAction(document, commentsQuery.fetchNextPage, 100);

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
                commentsQuery.data?.pages.map((commentPage) =>
                  commentPage.map((comment) => (
                    <Comment key={comment.id} {...comment} />
                  )),
                )
              )}
              {commentsQuery.isFetchingNextPage && <Loader />}
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
