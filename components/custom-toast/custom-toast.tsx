"use client";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import {
  CheckCircleIcon,
  InfoIcon,
  Loader2Icon,
  TriangleAlertIcon,
  XCircleIcon,
  XIcon,
} from "lucide-react";
import { ReactNode } from "react";
import { toast as sonnerToast } from "sonner";

export function toast(toast: Omit<ToastProps, "id">) {
  return sonnerToast.custom(
    (id) => (
      <Toast
        id={id}
        title={toast.title}
        description={toast.description}
        variant={toast.variant}
      />
    ),
    { position: "top-center" },
  );
}

const toastContainerVariant = cva(
  "p-3 rounded-3xl flex items-center justify-between gap-4 min-w-xs max-w-sm border shadow-xl w-full",
  {
    variants: {
      variant: {
        info: "bg-white border-slate-300",
        success: "bg-green-200 border-green-300",
        warning: "bg-amber-200 border-amber-300",
        error: "bg-rose-200 border-rose-300",
        loading: "bg-amber-200 border-amber-300",
      },
    },
  },
);

const toastIconContainerVariant = cva(
  "w-8 h-8 rounded-full grid place-items-center text-white border",
  {
    variants: {
      variant: {
        info: "bg-white border-slate-100",
        error: "bg-red-500 border-red-100",
        loading: "bg-yellow-500 border-red-100",
        warning: "bg-yellow-500 border-red-100",
        success: "bg-green-500 border-red-100",
      },
    },
  },
);


function Toast(props: ToastProps) {
  const { title, description, id, variant } = props;

  const toastIcons: Record<ToastVariantTypes, ReactNode> = {
    info: <InfoIcon />,
    error: <XCircleIcon />,
    loading: <Loader2Icon className="animate-spin" />,
    warning: <TriangleAlertIcon />,
    success: <CheckCircleIcon />,
  };

  return (
    <div className={cn(toastContainerVariant({ variant }))}>
      <div className="flex items-center gap-4">
        <div className={cn(toastIconContainerVariant({ variant }))}>
          {toastIcons[variant]}
        </div>

        <div>
          <p className="text-sm text-slate-950">{title}</p>
          <p className="empty:hidden text-xs opacity-75 text-slate-950">{description}</p>
        </div>
      </div>

      <button onClick={() => sonnerToast.dismiss(id)}>
        <XIcon className="w-4 text-slate-950" />
      </button>
    </div>
  );
}

type ToastVariantTypes = "success" | "warning" | "error" | "loading" | "info";

interface ToastProps {
  id: string | number;
  title: string;
  description: string;
  variant: ToastVariantTypes;
}