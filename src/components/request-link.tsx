"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { ContactKind } from "@/content/types";
import { followsInThisTab, requestContactKind } from "@/lib/contact/preselect";

interface RequestLinkProps {
  href: string;
  kind: ContactKind;
  children: ReactNode;
  className?: string;
}

const defaultClassName =
  "group mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-fg underline-offset-4 hover:underline";

// The anchor does the navigation (so it works without JavaScript); the click only tells the form what to preselect.
export function RequestLink({ href, kind, children, className = defaultClassName }: RequestLinkProps) {
  return (
    <Link href={href} onClick={(event) => followsInThisTab(event) && requestContactKind(kind)} className={className}>
      {children}
    </Link>
  );
}
