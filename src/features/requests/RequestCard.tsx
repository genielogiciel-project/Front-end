import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { FileText, MoreVertical, ChevronDown, ChevronUp, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ResourceType } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

interface RequestCardProps {
  request: any;
  onUpdate: () => void;
  onDelete: () => void;
}

export function RequestCard({ request, onUpdate, onDelete }: RequestCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <span>Demande #{request.id.slice(0, 8)}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Département: {request.departmentId}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={request.status} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onUpdate}>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              {request.items.length} article{request.items.length > 1 ? "s" : ""}
            </span>
          </div>
          <p className="text-sm line-clamp-2 text-muted-foreground">
            {request.justification}
          </p>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-4 mt-2 border-t">
                <div>
                  <h4 className="font-medium mb-2 text-sm">Articles demandés:</h4>
                  <div className="space-y-2">
                    {request.items.map((item: any, index: number) => (
                      <div key={index} className="pl-2 border-l-2 border-l-primary/20 text-sm">
                        <p className="font-medium">
                          {item.quantity}x {item.type === ResourceType.COMPUTER ? "Ordinateur" : "Imprimante"}
                        </p>
                        <p className="text-xs text-muted-foreground pl-1">
                          {item.type === ResourceType.COMPUTER
                            ? `${item.specifications.brand} ${item.specifications.cpu}`
                            : `${item.specifications.brand} ${item.specifications.resolution}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-1 text-sm">Justification complète:</h4>
                  <p className="text-sm text-muted-foreground">{request.justification}</p>
                </div>

                <div className="flex flex-wrap justify-between gap-2 text-xs text-muted-foreground pt-2">
                  <span>Créé le: {new Date(request.createdAt).toLocaleDateString()}</span>
                  <span>Mis à jour: {new Date(request.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}