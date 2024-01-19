import { useQuery } from "@tanstack/react-query";

export const useUserData = (userId) => {
  const userData = useQuery({
    queryKey: ["users", userId],
    queryFn: async () =>
      fetch(`/api/users/${userId}`).then((res) => res.json()),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  return userData;
};
