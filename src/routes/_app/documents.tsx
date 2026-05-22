import { createFileRoute } from "@tanstack/react-router";
import { SavedList } from "@/components/saved-list";

export const Route = createFileRoute("/_app/documents")({
  component: () => <SavedList title="Documents" />,
});
