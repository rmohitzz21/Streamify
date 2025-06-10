import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";

const useLogout = () => {
  const queryClient = useQueryClient();

  const {
    mutate: logoutMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: logout,
    onSuccess: () => { 
      // Clear JWT from localStorage or cookies
      localStorage.removeItem("jwt"); // Adjust key if different
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      window.location.href = "/login";
    }
  });

  return { logoutMutation, isPending, error };
};
export default useLogout;
