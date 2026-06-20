import { IconRadarFilled } from "@tabler/icons-react";
import { EmptyState } from "@/ui";

export default function RadarPage() {
  return (
    <div className="pb-28">
      <EmptyState
        icon={<IconRadarFilled />}
        title="Live Radar"
        description="An animated precipitation and storm radar map is on the way."
      />
    </div>
  );
}
