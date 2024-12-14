import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Consultants from "@/pages/Consultants";
import ConsultantProfile from "@/pages/ConsultantProfile";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/consultants" element={<Consultants />} />
        <Route path="/consultants/:id" element={<ConsultantProfile />} />
      </Routes>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;