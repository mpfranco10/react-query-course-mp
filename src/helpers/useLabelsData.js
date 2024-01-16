import { useQuery } from "react-query";

const useLabelsData = () => {
  const labelsQuery = useQuery(["labels"], () =>
    fetch("/api/labels").then((res) => res.json())
  );

  return labelsQuery;
};

export default useLabelsData;
