import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export default function AddIssue() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isLoading, mutate: addIssue } = useMutation({
    mutationFn: (issueBody) =>
      fetch("/api/issues", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(issueBody),
      }).then((res) => res.json()),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["issues"], { exact: true });
      queryClient.setQueryData(["issues", data.number.toString()], data);
      navigate(`/issue/${data.number}`);
    },
  });

  return (
    <div className="add-issue">
      <h2>Add Issue</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (isLoading) {
            return;
          }
          addIssue({
            comment: event.target.comment.value,
            title: event.target.title.value,
          });
        }}
      >
        <label htmlFor="title">Title</label>
        <input type="text" id="title" placeholder="Title" name="title" />

        <label htmlFor="comment">Comment</label>
        <textarea placeholder="Comment" id="comment" name="comment" />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Adding Issue" : "Add Issue"}
        </button>
      </form>
    </div>
  );
}
