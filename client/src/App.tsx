import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import ApplicationPage from "@/pages/application-page";
import DocumentsPage from "@/pages/documents-page";
import AdminPage from "@/pages/admin-page";
import LandingPage from "@/pages/landing-page";
import { ProtectedRoute, StudentRoute } from "./lib/protected-route";
import { AdminRoute } from "./lib/admin-route";
import { AuthProvider } from "./hooks/use-auth";

function Router() {
  return (
    <Switch>
      {/* Public route that redirects based on auth status and role */}
      <Route path="/" component={LandingPage} />
      
      {/* Authentication route */}
      <Route path="/auth" component={AuthPage} />
      
      {/* Student-only routes */}
      <StudentRoute path="/dashboard" component={DashboardPage} />
      <StudentRoute path="/apply" component={ApplicationPage} />
      <StudentRoute path="/documents" component={DocumentsPage} />
      
      {/* Admin-only route */}
      <AdminRoute path="/admin" component={AdminPage} />
      
      {/* 404 route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
