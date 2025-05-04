import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading } = useAuth();
  
  // Special case for admin route
  const isAdminRoute = path.startsWith("/admin");
  const hasAdminAccess = user?.role === "admin";

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      </Route>
    );
  }

  // Handle authentication check
  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // Handle admin authorization check
  if (isAdminRoute && !hasAdminAccess) {
    return (
      <Route path={path}>
        <Redirect to="/" />
      </Route>
    );
  }

  // User is authenticated and authorized
  return <Route path={path} component={Component} />;
}
