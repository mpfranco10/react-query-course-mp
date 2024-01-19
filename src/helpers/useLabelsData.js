import { useQuery } from "@tanstack/react-query";

const useLabelsData = () => {
  const labelsQuery = useQuery({
    queryKey: ["labels"],
    queryFn: async () => fetch("/api/labels").then((res) => res.json()),
    staleTime: 1000 * 60 * 60,
  });

  return labelsQuery;
};

export default useLabelsData;
