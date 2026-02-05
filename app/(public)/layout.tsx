import { GoblinHeader } from "@/components/layout/GoblinHeader";
import { GoblinFooter } from "@/components/layout/GoblinFooter";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <GoblinHeader />
      <main className="flex-1">
        {children}
      </main>
      <GoblinFooter />
    </div>
  );
}
