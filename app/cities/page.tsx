import { IconMapPinFilled } from "@tabler/icons-react";
import { EmptyState } from "@/ui";

export default function CitiesPage() {
  return (
    <div className="pb-28">
      <EmptyState
        icon={<IconMapPinFilled />}
        title="Saved Cities"
        description="Soon you'll be able to pin multiple cities and compare their weather side by side."
      />
    </div>
  );
}
