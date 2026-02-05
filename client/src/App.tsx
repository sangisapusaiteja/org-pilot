import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import LoginPage from "@/pages/login";

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <LoginPage />
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
