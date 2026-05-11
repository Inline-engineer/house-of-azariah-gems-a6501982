import { ReactNode } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { WhatsAppButton } from "./WhatsAppButton";
import { Chatbot } from "./Chatbot";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Nav />
      <main className="pt-20">{children}</main>
      <Footer />
      <WhatsAppButton />
      <Chatbot />
    </div>
  );
}
