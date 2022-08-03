import React, { ReactNode } from "react";

// Based on React TypeScript Cheatsheet
// (https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/error_boundaries/)
interface Props {
  fallback: ReactNode;
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state = { hasError: false };

  public static getDerivedStateFromError(error: Error) {
    console.error(error);
    return { hasError: true };
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
