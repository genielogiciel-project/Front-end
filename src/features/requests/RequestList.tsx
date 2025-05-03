import { RequestCard } from "./RequestCard";
import { useState } from "react";
import { UpdateRequestModal } from "./UpdateRequestModal"; // we'll create this!

interface RequestListProps {
  isLoading: boolean;
  requests: any[];
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
          <RequestCard
            key={request.id}
            request={request}
            onUpdate={() => setEditingRequest(request)}
            onDelete={() => onDelete(request.id)}
          />
        ))}
      </div>

      {editingRequest && (
        <UpdateRequestModal
          open={!!editingRequest}
          request={editingRequest}
          onClose={() => setEditingRequest(null)}
          onSubmit={(updatedData) => {
            onUpdate(editingRequest.id, updatedData);
            setEditingRequest(null);

            console.log(editingRequest.id, updatedData);
          }}
        />
      )}
    </>
  );
}
