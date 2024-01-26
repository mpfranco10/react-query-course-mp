import { useQuery } from "@tanstack/react-query";
import { defaultLabels } from "./defaultData";

const useLabelsData = () => {
  const labelsQuery = useQuery({
    queryKey: ["labels"],
    queryFn: async ({ signal }) =>
      fetch("/api/labels", { signal }).then((res) => res.json()),
    staleTime: 1000 * 60 * 60,
    placeholderData: defaultLabels,
  });

  return labelsQuery;
};

export default useLabelsData;
