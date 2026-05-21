import { Outlet } from "react-router-dom";
import SideNav from "./SideNav";
import TopAppBar from "./TopAppBar";

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <SideNav />
      <main className="ml-64 flex flex-col h-full w-full">
        <TopAppBar />
        <div className="p-stack-lg flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
