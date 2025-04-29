import { useState } from "react";
import { Header } from "@/features/requests/Header";
import { FilterBar } from "@/features/requests/FilterBar";
import { RequestList } from "@/features/requests/RequestList";
import { NewRequestModal } from "@/features/requests/newRequestModal";
import { useAppSelector } from "@/lib/store";
import { RequestStatus } from "@/lib/types";
import {
  useGetAllRequests,
  useCreateRequest,
  useUpdateRequest,
  useDeleteRequest,
} from "@/hooks/useRequestApi";

export default function Requests() {
  // const { requests } = useAppSelector((state) => state.requests);
  const { data: requests, isLoading } = useGetAllRequests();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "ALL">(
    "ALL"
  );
  const { mutate: createRequest } = useCreateRequest();
  const { mutate: updateRequest } = useUpdateRequest();
  const { mutate: deleteRequest } = useDeleteRequest();
  const [isModalOpen, setIsModalOpen] = useState(false);

  let filteredRequests = requests;
  // if (!requests || requests.length === 0) {
  //   return <p>Aucune requête trouvée.</p>;
  // }
  if (!isLoading) {
    filteredRequests = requests?.filter(
      ({ id, status }) =>
        id.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (statusFilter === "ALL" || status === statusFilter)
    );
  }

  const handleNewRequestSubmit = (data: any) => {
    createRequest(data);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
      <Header onNewRequestClick={() => setIsModalOpen(true)} />
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />
      <RequestList
        isLoading={isLoading}
        requests={filteredRequests}
        onUpdate={(id, updatedData) => updateRequest({ id, ...updatedData })}
        onDelete={(id) => {
          if (confirm("Are you sure you want to delete this request?")) {
            deleteRequest(id);
          }
        }}
      />

      <NewRequestModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => {
          handleNewRequestSubmit(data);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
