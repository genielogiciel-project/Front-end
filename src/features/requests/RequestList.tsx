import { RequestCard } from "./RequestCard";
import { useState } from "react";
import { UpdateRequestModal } from "./UpdateRequestModal";
import Masonry from "react-masonry-css";
import { ResourceRequest } from "@/lib/types";

interface RequestListProps {
  isLoading: boolean;
  requests: ResourceRequest[];
  onUpdate: (id: string, updatedData: any) => void;
  onDelete: (id: string) => void;
}

export function RequestList({
  isLoading,
  requests,
  onUpdate,
  onDelete,
}: RequestListProps) {
  const [editingRequest, setEditingRequest] = useState<any>(null);

  if (isLoading) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Chargement des demandes...
      </div>
    );
  }
  if (!requests || requests.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Aucune demande trouvée.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-min">
        {requests?.map((request) => (
          <Masonry
            breakpointCols={1}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
            key={request.id}
          >
            <RequestCard
              request={request}
              onUpdate={() => setEditingRequest(request)}
              onDelete={() => onDelete(request.id)}
            />
          </Masonry>
        ))}
      </div>

      {editingRequest && (
        <UpdateRequestModal
          open={!!editingRequest}
          request={editingRequest}
          onClose={() => setEditingRequest(null)}
          // onSubmit={(updatedData) => {
          //   onUpdate(editingRequest.id, updatedData);
          //   setEditingRequest(null);

          //   console.log(editingRequest.id, updatedData);
          // }}
        />
      )}
    </>
  );
}
