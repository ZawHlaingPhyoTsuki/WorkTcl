import { api } from "@/lib/axios";
import { JobValues } from "@/lib/schemas/JobSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: JobValues) => api.post("/jobs", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};
