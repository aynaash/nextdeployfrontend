import Navbar from "@/components/navbar";
import "@/app/globals.css";
import { Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <Toaster />
    </>
  );
}
