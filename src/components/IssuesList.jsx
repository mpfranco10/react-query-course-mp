import { useQuery } from "@tanstack/react-query";
import { IssueItem } from "./IssueItem";
import { useState } from "react";
import fetchWithError from "../helpers/fetchWithError";
import Loader from "./Loader";

export default function IssuesList({ labelsData, labels, status }) {
  const {
    isLoading: isLoadingIssues,
    data: issuesData,
    isError: isErrorIssues,
    error: issuesError,
    isFetching: isIssuesQueryFetching,
  } = useQuery({
    queryKey: ["issues", { labels, status }],
    queryFn: ({ signal }) => {
      const statusString = status ? `&status=${status}` : "";
      const labelsString = labels.map((label) => `labels[]=${label}`).join("&");
      return fetchWithError(`/api/issues?${labelsString}${statusString}`, {
        signal,
      });
    },
  });

  const [searchValue, setSearchValue] = useState("");
  const isSearching = !!searchValue;

  const { isLoading: isLoadingSearch, data: searchData } = useQuery({
    queryKey: ["issues", "search", searchValue],
    queryFn: ({ signal }) =>
      fetch(`/api/search/issues?q=${searchValue}`, { signal }).then((res) =>
        res.json()
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
