import type { HTMLAttributes } from "react";

import classNames from "classnames";

import "./Loader.scss";

interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Size of the loader in pixels (default: 24) */
  size?: number;
  /** Custom CSS class name */
  className?: string;
  /** Center the loader in its container */
  center?: boolean;
}

export function Loader({
  size = 24,
  className,
  center = false,
  ...props
}: LoaderProps): JSX.Element {
  return (
    <div
      className={classNames("loaderContainer", className, {
        center: center,
      })}
      {...props}
    >
      <div
        className="loader"
        style={{
          width: size,
          height: size,
          borderWidth: Math.max(2, size / 8),
        }}
      />
    </div>
  );
}
