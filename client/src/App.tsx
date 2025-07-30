import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Game from "@/pages/game";
import Stats from "@/pages/stats";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/game">
        {(params) => <Game />}
      </Route>
      <Route path="/challenge">
        {(params) => <Game mode="challenge" />}
      </Route>
      <Route path="/daily">
        {(params) => <Game mode="daily" />}
      </Route>
      <Route path="/stats" component={Stats} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
