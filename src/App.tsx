import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Consultants from "@/pages/Consultants";
import ConsultantProfile from "@/pages/ConsultantProfile";
import AddConsultant from "@/pages/AddConsultant";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/consultants" element={<Consultants />} />
          <Route path="/consultants/add" element={<AddConsultant />} />
          <Route path="/consultants/:id" element={<ConsultantProfile />} />
        </Routes>
        <Toaster />
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;