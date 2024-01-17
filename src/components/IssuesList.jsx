import { useQuery } from "react-query";
import { IssueItem } from "./IssueItem";
import { useState } from "react";

export default function IssuesList({ labelsData, labels, status }) {
  const { isLoading: isLoadingIssues, data: issuesData } = useQuery(
    ["issues", { labels, status }],
    () => {
      const statusString = status ? `&status=${status}` : "";
      const labelsString = labels.map((label) => `labels[]=${label}`).join("&");
      return fetch(`/api/issues?${labelsString}${statusString}`).then((res) =>
        res.json()
      );
    }
  );

  const [searchValue, setSearchValue] = useState("");

  const {
    isLoading: isLoadingSearch,
    data: searchData,
    fetchStatus: searchFetchStatus,
  } = useQuery(
    ["issues", "search", searchValue],
    () => {
      return fetch(`/api/search/issues?q=${searchValue}`).then((res) =>
        res.json()
      );
    },
    { enabled: !!searchValue }
  );

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
      <h2>Issues List</h2>
      {isLoadingIssues ? (
        <p>Loading....</p>
      ) : searchFetchStatus === "idle" && isLoadingSearch ? (
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
      ) : (
        <>
          <h2>Search results</h2>
          {isLoadingSearch ? (
            <p>Loading...</p>
          ) : (
            <>
              <p>{searchData.count} Results</p>
              <ul className="issues-list">
                {searchData.items.map((issue) => (
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
        </>
      )}
    </div>
  );
}
