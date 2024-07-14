import { FlagAdminList } from "../components/FlagAdminList";
import NoSSR from "@sln/core/components/NoSSR";
import { Meta, SkeletonText, SkeletonContainer } from "@sln/ui";
import { Suspense } from "react";

const SkeletonLoader = () => {
  return (
    <SkeletonContainer>
      <div className="divide-subtle mb-8 mt-6 space-y-6">
        <SkeletonText className="h-8 w-full" />
        <SkeletonText className="h-8 w-full" />
      </div>
    </SkeletonContainer>
  );
};

export const FlagListingView = () => {
  return (
    <>
      <Meta
        title="Feature Flags"
        description="Here you can toggle your Cal.com instance features."
      />
      <NoSSR>
        <Suspense fallback={<SkeletonLoader />}>
          <FlagAdminList />
        </Suspense>
      </NoSSR>
    </>
  );
};
