import useLabelsData from "../helpers/useLabelsData";
import { GoGear } from "react-icons/go";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const IssueLabels = ({ labels, issueNumber }) => {
  const labelsQuery = useLabelsData();
  const [menuOpen, setMenuOpen] = useState(false);

  const queryClient = useQueryClient();
  const { mutate: setLabels } = useMutation({
    mutationFn: (labelId) => {
      const newLabels = labels.includes(labelId)
        ? labels.filter((currentLabel) => currentLabel !== labelId)
        : [...labels, labelId];
      return fetch(`/api/issues/${issueNumber}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ labels: newLabels }),
      }).then((res) => res.json());
    },
    onMutate: (labelId) => {
      const oldLabels = queryClient.getQueryData([
        "issues",
        issueNumber,
      ]).labels;

      const newLabels = oldLabels.includes(labelId)
        ? oldLabels.filter((currentLabel) => currentLabel !== labelId)
        : [...oldLabels, labelId];

      queryClient.setQueryData(["issues", issueNumber], (data) => ({
        ...data,
        labels: newLabels,
      }));

      return function rollback() {
        queryClient.setQueryData(["issues", issueNumber], (data) => {
          const rollbackLabels = oldLabels.includes(labelId)
            ? [...data.labels, labelId]
            : data.filter((currentLabel) => currentLabel !== labelId);
          return {
            ...data,
            labels: rollbackLabels,
          };
        });
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
        <span>Labels</span>
        {labelsQuery.isLoading
          ? null
          : labels.map((label) => {
              const labelObject = labelsQuery.data.find(
                (queryLabel) => queryLabel.id === label,
              );

              return labelObject ? (
                <span
                  key={labelObject.id}
                  className={`label ${labelObject.color}`}
                >
                  {labelObject.name}
                </span>
              ) : null;
            })}
      </div>
      <GoGear
        onClick={() => !labelsQuery.isLoading && setMenuOpen((open) => !open)}
      />
      {menuOpen && (
        <div className="picker-menu labels">
          {labelsQuery.data?.map((label) => {
            const selected = labels.includes(label.id);
            return (
              <div
                key={label.id}
                className={selected ? "selected" : ""}
                onClick={() => {
                  setLabels(label.id);
                  setMenuOpen(false);
                }}
              >
                <span
                  className="label-dot"
                  style={{ backgroundColor: label.color }}
                ></span>
                {label.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default IssueLabels;
