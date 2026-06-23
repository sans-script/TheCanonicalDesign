import { Providers } from "./providers";
import { Layout } from "./components/layout/Layout";
import "./globals.css";

export const metadata = {
  title: "Neumann Dashboard",
  description: "Dashboard application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
