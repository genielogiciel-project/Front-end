import { Loader, Loader2 } from "lucide-react";

export function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin">
        {/* <Loader className="h-8 w-8 text-primary" /> */}
        <Loader2 className="h-8 w-8 text-primary" />
      </div>
    </div>
  );
}
