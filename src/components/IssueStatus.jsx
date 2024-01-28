import { StatusSelect } from "./StatusSelect";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const IssueStatus = ({ status, issueNumber }) => {
  const queryClient = useQueryClient();
  const { mutate: setStatus } = useMutation({
    mutationFn: (status) =>
      fetch(`/api/issues/${issueNumber}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ status }),
      }).then((res) => res.json()),
    onMutate: (status) => {
      const oldStatus = queryClient.getQueryData([
        "issues",
        issueNumber,
      ]).status;

      queryClient.setQueryData(["issues", issueNumber], (data) => ({
        ...data,
        status,
      }));

      return function rollback() {
        queryClient.setQueryData(["issues", issueNumber], (data) => ({
          ...data,
          status: oldStatus,
        }));
      };
    },
    onError: (error, variables, rollback) => {
      rollback();
    },
    onSettled: () => {
      queryClient.invalidateQueries(["issues", issueNumber], { exact: true });
    },
    onSuccess: (data) => {
      console.log("success", data);
    },
  });

  return (
    <div className="issue-options">
      <div>
        <span>Status</span>
        <StatusSelect
          noEmptyOption
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default IssueStatus;
