import { api } from "@/lib/axios";
import { FormValues } from "@/lib/FormSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormValues) => api.post("/jobs", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};
