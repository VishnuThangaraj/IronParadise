import type { ReactNode } from "react";
import MuiSkeleton, {
  type SkeletonProps as MuiSkeletonProps,
} from "@mui/material/Skeleton";

export interface SkeletonProps extends MuiSkeletonProps {
  /**
   * Whether the content is currently in a loading state.
   * When false, children are rendered directly without any skeleton wrapper.
   * Defaults to true.
   */
  loading?: boolean;
  children?: ReactNode;
}

const Skeleton = ({
  loading = true,
  children,
  animation = "wave",
  className = "",
  ...props
}: SkeletonProps) => {
  if (!loading) {
    return <>{children}</>;
  }

  return (
    <MuiSkeleton
      animation={animation}
      className={`dark:bg-slate-800/60 rounded-lg ${className}`}
      {...props}
    >
      {children}
    </MuiSkeleton>
  );
};

export default Skeleton;
