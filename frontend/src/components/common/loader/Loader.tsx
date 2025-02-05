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
  /** Optional message to display below the loader */
  message?: string;
}

export function Loader({
  size = 24,
  className,
  center = false,
  message,
  ...props
}: LoaderProps): JSX.Element {
  return (
    <div
      className={classNames("loaderContainer", className, {
        center: center,
      })}
      {...props}
    >
      <div className="loader__content">
        <div
          className="loader"
          style={{
            width: size,
            height: size,
            borderWidth: Math.max(2, size / 8),
          }}
        />
        {message && <h2 className="loader__message">{message}</h2>}
      </div>
    </div>
  );
}
