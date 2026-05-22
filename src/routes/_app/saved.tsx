import { createFileRoute } from "@tanstack/react-router";
import { SavedList } from "@/components/saved-list";

export const Route = createFileRoute("/_app/saved")({
  component: () => <SavedList title="Saved Work" />,
});
