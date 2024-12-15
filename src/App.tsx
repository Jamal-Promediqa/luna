import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import AITranscriptions from "@/pages/AITranscriptions";
import Consultants from "@/pages/Consultants";
import ConsultantProfile from "@/pages/ConsultantProfile";
import RingLista from "@/pages/RingLista";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import Tasks from "@/pages/Tasks";
import Notifications from "@/pages/Notifications";
import BackgroundChecks from "@/pages/BackgroundChecks";
import Email from "@/pages/Email";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Toaster />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ai-transcriptions" element={<AITranscriptions />} />
            <Route path="/consultants" element={<Consultants />} />
            <Route path="/consultants/:id" element={<ConsultantProfile />} />
            <Route path="/ring-lista" element={<RingLista />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/background-checks" element={<BackgroundChecks />} />
            <Route path="/email" element={<Email />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;