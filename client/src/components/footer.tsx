import { HelpCircle, Mail, Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container mx-auto px-4 py-6 md:flex md:items-center md:justify-between">
        <div className="flex justify-center space-x-6 md:order-2">
          <a href="#" className="text-slate-400 hover:text-slate-500">
            <span className="sr-only">Help Center</span>
            <HelpCircle className="h-5 w-5" />
          </a>
          <a href="#" className="text-slate-400 hover:text-slate-500">
            <span className="sr-only">Contact</span>
            <Mail className="h-5 w-5" />
          </a>
          <a href="#" className="text-slate-400 hover:text-slate-500">
            <span className="sr-only">Privacy Policy</span>
            <Shield className="h-5 w-5" />
          </a>
        </div>
        <div className="mt-4 md:order-1 md:mt-0">
          <p className="text-center text-sm text-slate-500">&copy; {new Date().getFullYear()} Karatina University. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
