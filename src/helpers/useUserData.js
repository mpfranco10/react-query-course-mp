import { useQuery } from "react-query";

export const useUserData = (userId) => {
  const userData = useQuery(
    ["users", userId],
    () => fetch(`/api/users/${userId}`).then((res) => res.json()),
    { enabled: !!userId }
  );

  return userData;
};
