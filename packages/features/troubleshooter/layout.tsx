import type Shell from "@sln/features/shell/Shell";
import { ErrorBoundary, Icon } from "@sln/ui";
import type { ComponentProps } from "react";
import React, { Suspense } from "react";

export default function TroubleshooterLayout({
  children,
}: { children: React.ReactNode } & ComponentProps<typeof Shell>) {
  return (
    <div className="flex flex-1 [&>*]:flex-1">
      <ErrorBoundary>
        <Suspense fallback={<Icon name="loader" />}>{children}</Suspense>
      </ErrorBoundary>
    </div>
  );
}

export const getLayout = (page: React.ReactElement) => (
  <TroubleshooterLayout>{page}</TroubleshooterLayout>
);
