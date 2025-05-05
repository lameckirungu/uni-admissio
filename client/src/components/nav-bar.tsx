import { useAuth } from "@/hooks/use-auth";
import { School } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function NavBar() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  if (!user) {
    return null;
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    const email = user.username || "";
    return email.substring(0, 2).toUpperCase();
  };

  // Handle logout
  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  // Check if the link is active
  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <School className="h-6 w-6 text-primary-600" />
          <span className="text-xl font-semibold text-slate-900">Admissio</span>
        </div>
        
        <nav className="ml-auto flex items-center gap-6">
          {/* Student navigation links */}
          {user.role === "student" && (
            <>
              <Link href="/dashboard" className={`text-sm font-medium ${isActive('/dashboard') ? 'text-primary-600' : 'text-slate-600 hover:text-slate-900'}`}>
                Dashboard
              </Link>
              <Link href="/apply" className={`text-sm font-medium ${isActive('/apply') ? 'text-primary-600' : 'text-slate-600 hover:text-slate-900'}`}>
                Application
              </Link>
              <Link href="/documents" className={`text-sm font-medium ${isActive('/documents') ? 'text-primary-600' : 'text-slate-600 hover:text-slate-900'}`}>
                Documents
              </Link>
            </>
          )}

          {/* Admin navigation links */}
          {user.role === "admin" && (
            <Link href="/admin" className={`text-sm font-medium ${isActive('/admin') ? 'text-primary-600' : 'text-slate-600 hover:text-slate-900'}`}>
              Admin Dashboard
            </Link>
          )}
          
          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 rounded-full bg-slate-100 p-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-slate-300 text-slate-600">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-block">{user.username}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <span className="text-sm font-medium">{user.username}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span className="text-sm">{user.role}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}
