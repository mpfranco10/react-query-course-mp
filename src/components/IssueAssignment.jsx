import { useState } from "react";
import { useUserData } from "../helpers/useUserData";
import { GoGear } from "react-icons/go";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const IssueAssignment = ({ assignee, issueNumber }) => {
  const user = useUserData(assignee);
  const [menuOpen, setMenuOpen] = useState(false);
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => fetch("/api/users").then((res) => res.json()),
    staleTime: 60 * 1000 * 5,
  });
  const queryClient = useQueryClient();

  const { mutate: setAssignment } = useMutation({
    mutationFn: (assignee) =>
      fetch(`/api/issues/${issueNumber}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ assignee }),
      }).then((res) => res.json()),
    onMutate: (assignee) => {
      const oldAssignee = queryClient.getQueryData([
        "issues",
        issueNumber,
      ]).assignee;

      queryClient.setQueryData(["issues", issueNumber], (data) => ({
        ...data,
        assignee,
      }));

      return function rollback() {
        queryClient.setQueryData(["issues", issueNumber], (data) => ({
          ...data,
          assignee: oldAssignee,
        }));
      };
    },
    onError: (error, variables, rollback) => {
      rollback();
    },
    onSettled: () => {
      queryClient.invalidateQueries(["issues", issueNumber], { exact: true });
    },
  });

  return (
    <div className="issue-options">
      <div>
        <span>Assignment</span>
        {user.data ? (
          <div>
            <img src={user.data.profilePictureUrl} alt={user.data.name} />
            {user.data.name}
          </div>
        ) : (
          <p>No assignee set</p>
        )}
      </div>
      <GoGear
        onClick={() => !usersQuery.isLoading && setMenuOpen((open) => !open)}
      />
      {menuOpen && (
        <div className="picker-menu">
          {usersQuery.data?.map((user) => (
            <div
              key={user.id}
              onClick={() => {
                setAssignment(user.id);
                setMenuOpen(false);
              }}
            >
              <img src={user.profilePictureUrl} alt={user.name} />
              {user.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IssueAssignment;
