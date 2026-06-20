import { IconSettingsFilled } from "@tabler/icons-react";
import { EmptyState } from "@/ui";

export default function SettingsPage() {
  return (
    <div className="pb-28">
      <EmptyState
        icon={<IconSettingsFilled />}
        title="Settings"
        description="Units, theme and notification preferences will live here."
      />
    </div>
  );
}
