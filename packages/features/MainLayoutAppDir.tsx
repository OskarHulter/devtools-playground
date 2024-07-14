"use client";

import Shell from "@sln/features/shell/Shell";
import type { ComponentProps } from "react";
import React from "react";

export default function MainLayout({
  children,
  ...rest
}: { children: React.ReactNode } & ComponentProps<typeof Shell>) {
  return (
    <Shell withoutMain={true} {...rest}>
      {children}
    </Shell>
  );
}

export const getLayout = (page: React.ReactElement) => (
  <MainLayout>{page}</MainLayout>
);
