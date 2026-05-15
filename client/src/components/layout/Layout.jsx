import { Outlet } from "react-router-dom";
import SideNav from "./SideNav";
import TopAppBar from "./TopAppBar";

export default function Layout() {
  return (
    <div className="flex">
      <SideNav />
      <main className="ml-64 flex flex-col min-h-screen w-full">
        <TopAppBar />
        <div className="p-stack-lg">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
