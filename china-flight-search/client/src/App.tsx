// 设计风格：航空仪表盘 · 深蓝夜空极简主义
// 布局：左侧固定侧边栏（历史查询 + 静态信息导航）+ 右侧主内容区

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Sidebar from "@/components/Sidebar";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import Routes from "@/pages/Routes";
import QueryDetail from "@/pages/QueryDetail";
import { Route, Switch, Router as WouterRouter } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content — offset by sidebar width on desktop */}
      <main className="flex-1 lg:ml-64 min-w-0">
        {children}
      </main>
    </div>
  );
}

function Router() {
  // Support base path for GitHub Pages deployment (e.g., /home-automation/)
  const base = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
  return (
    <WouterRouter base={base}>
      <Layout>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/routes" component={Routes} />
          <Route path="/query/:id" component={QueryDetail} />
          <Route path="/404" component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </WouterRouter>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
