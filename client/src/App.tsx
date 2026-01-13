import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import TuVi from "./pages/TuVi";
import Numerology from "./pages/Numerology";
import Zodiac from "./pages/Zodiac";
import Auspicious from "./pages/Auspicious";
import Tet from "./pages/Tet";
import History from "./pages/History";
import Admin from "./pages/Admin";
import Compatibility from "./pages/Compatibility";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/tuvi" component={TuVi} />
      <Route path="/numerology" component={Numerology} />
      <Route path="/zodiac" component={Zodiac} />
      <Route path="/auspicious" component={Auspicious} />
      <Route path="/tet" component={Tet} />
      <Route path="/history" component={History} />
      <Route path="/admin" component={Admin} />
      <Route path="/compatibility" component={Compatibility} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
