import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { IssueItem } from "./IssueItem";
import { useEffect, useState } from "react";
import fetchWithError from "../helpers/fetchWithError";
import Loader from "./Loader";

const fetchIssues = async ({ status, labels, pageNum, signal }) => {
  const statusString = status ? `&status=${status}` : "";
  const labelsString = labels.map((label) => `labels[]=${label}`).join("&");
  const paginationString = pageNum ? `&page=${pageNum}` : "";

  const results = await fetchWithError(
    `/api/issues?${labelsString}${statusString}${paginationString}`,
    {
      signal,
    },
  );

  return results;
};

export default function IssuesList({
  labelsData,
  labels,
  status,
  pageNum,
  setPageNum,
}) {
  const queryClient = useQueryClient();
  const {
    isLoading: isLoadingIssues,
    data: issuesData,
    isError: isErrorIssues,
    error: issuesError,
    isFetching: isIssuesQueryFetching,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["issues", { labels, status, pageNum }],
    queryFn: async ({ signal }) => {
      const results = await fetchIssues({ status, labels, pageNum, signal });

      results.forEach((issue) => {
        queryClient.setQueryData(["issues", issue.number.toString()], issue);
      });

      return results;
    },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["issues", { labels, status, pageNum: pageNum + 1 }],
      queryFn: async ({ signal }) => {
        const results = await fetchIssues({ status, labels, pageNum, signal });
        return results;
      },
    });
  }, [pageNum]);

  const [searchValue, setSearchValue] = useState("");
  const isSearching = !!searchValue;

  const { isLoading: isLoadingSearch, data: searchData } = useQuery({
    queryKey: ["issues", "search", searchValue],
    queryFn: ({ signal }) =>
      fetch(`/api/search/issues?q=${searchValue}`, { signal }).then((res) =>
        res.json(),
      ),
    enabled: isSearching,
  });

  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSearchValue(event.target.elements.search.value);
        }}
      >
        <label htmlFor="search">Search Issues</label>
        <input
          type="search"
          placeholder="Search"
          name="search"
          id="search"
          onChange={(event) => {
            if (event.target.value.length === 0) {
              setSearchValue("");
            }
          }}
        />
      </form>
      {isSearching && <h2>Search Results</h2>}
      {!isSearching && (
        <h2>Issues List {isIssuesQueryFetching && <Loader />}</h2>
      )}
      {(isLoadingIssues || isLoadingSearch) && <p>Loading....</p>}
      {isErrorIssues && <p>{issuesError.message}</p>}
      {issuesData && !isSearching && (
        <>
          <ul className="issues-list">
            {issuesData.map((issue) => (
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
          <div className="pagination">
            <button
              onClick={() => {
                if (pageNum - 1 > 0) {
                  setPageNum(pageNum - 1);
                }
              }}
              disabled={pageNum === 1}
            >
              Previous
            </button>
            <p>
              Page {pageNum} {isIssuesQueryFetching ? "..." : ""}
            </p>
            <button
              onClick={() => {
                if (issuesData?.length !== 0 && !isPlaceholderData) {
                  setPageNum(pageNum + 1);
                }
              }}
              disabled={issuesData?.length === 0 || isPlaceholderData}
            >
              Next
            </button>
          </div>
        </>
      )}
      {isSearching && searchData && (
        <>
          <p>{searchData?.count} Results found</p>
          <ul className="issues-list">
            {searchData?.items.map((issue) => (
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
        </>
      )}
    </div>
  );
}
