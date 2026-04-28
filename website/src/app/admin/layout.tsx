export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="step-dark-zone min-h-screen bg-[#0a0a0a] text-white antialiased">
      {children}
    </div>
  );
}
