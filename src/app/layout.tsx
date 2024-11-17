// app/layout.tsx
import './globals.css';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Add global layout components like Navbar here */}
        {children}
      </body>
    </html>
  );
}
