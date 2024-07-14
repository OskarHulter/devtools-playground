import WebhookListItemSkeleton from "./WebhookListItemSkeleton";
import { SkeletonContainer } from "@sln/ui";

export default function WebhookListSkeleton() {
  return (
    <SkeletonContainer>
      <div className="border-subtle divide-subtle mb-8 mt-6 divide-y rounded-md border">
        <WebhookListItemSkeleton />
        <WebhookListItemSkeleton />
        <WebhookListItemSkeleton />
      </div>
    </SkeletonContainer>
  );
}
