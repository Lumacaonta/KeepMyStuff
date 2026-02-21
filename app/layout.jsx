export const metadata = {
  title: "KeepMyStuff",
  description: "App per gestire i prodotti"
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body style={{ margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
