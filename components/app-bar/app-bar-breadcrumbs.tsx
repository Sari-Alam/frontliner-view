"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function AppBarBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const breadCrumbItemRenderer = () => {
    return segments.map((url, i) => {
      const isEndOfSegment = i === segments.length - 1;
      const href = `/${segments.slice(0, i + 1).join("/")}`;
      const formattedUrl = url.replaceAll("-", " ");

      return (
        <React.Fragment key={url}>
          <BreadcrumbItem>
            {!isEndOfSegment ? (
              <BreadcrumbLink asChild>
                <Link href={href} className="capitalize text-lg">
                  {formattedUrl}
                </Link>
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>
                <span className="capitalize text-lg"> {formattedUrl}</span>
              </BreadcrumbPage>
            )}
          </BreadcrumbItem>

          {!isEndOfSegment ? <BreadcrumbSeparator /> : <></>}
        </React.Fragment>
      );
    });
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>{breadCrumbItemRenderer()}</BreadcrumbList>
    </Breadcrumb>
  );
}