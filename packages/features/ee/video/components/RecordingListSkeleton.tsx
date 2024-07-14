import RecordingListItemSkeleton from "./RecordingListItemSkeleton";
import { SkeletonContainer } from "@sln/ui";

export default function RecordingListSkeleton() {
  return (
    <SkeletonContainer>
      <div className="flex flex-col gap-3">
        <RecordingListItemSkeleton />
        <RecordingListItemSkeleton />
        <RecordingListItemSkeleton />
      </div>
    </SkeletonContainer>
  );
}
