import { useAPI } from "@/api";
import { User } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllUsers = () => {
  const api = useAPI();

  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await api.get("/user");
      return data;
    },
  });
};

export const useGetAllTeachers = () => {
  const api = useAPI();

  return useQuery<User[]>({
    queryKey: ["teachers"],
    queryFn: async () => {
      const { data } = await api.get("/user/teachers");
      return data;
    },
  });
}

export const useGetAllTechnicians = () => {
  const api = useAPI();

  return useQuery<User[]>({
    queryKey: ["teachers"],
    queryFn: async () => {
      const { data } = await api.get("/user/technicians");
      return data;
    },
  });
};

export const useCreateUser = () => {
  const api = useAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newUser: Omit<User, "id">) => {
      const { data } = await api.post("/user", newUser);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUser = () => {
  const api = useAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updatedData }: { id: string; updatedData: Partial<User> }) => {
      const { data } = await api.put(`/user/${id}`, updatedData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteUser = () => {
  const api = useAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/user/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
