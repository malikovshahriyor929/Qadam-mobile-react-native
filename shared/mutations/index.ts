import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Myasxios } from "../generics";

export const useAvatarMutation = () => {
  return useMutation({
    mutationKey: ["avatar"],
    mutationFn: (data) => Myasxios.patch("/users/avatar", data),
  });
};
