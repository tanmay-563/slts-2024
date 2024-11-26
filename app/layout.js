import localFont from "next/font/local";
import "./globals.css";

const gilroy = localFont({
  src: [
    {
      path: "../public/gilroy/Gilroy-Black.ttf",
      weight: "900",
      style: "normal"
    },
    {
      path: "../public/gilroy/Gilroy-BlackItalic.ttf",
      weight: "900",
      style: "italic"
    },
    {
      path: "../public/gilroy/Gilroy-Bold.ttf",
      weight: "700",
      style: "normal"
    },
    {
      path: "../public/gilroy/Gilroy-BoldItalic.ttf",
      weight: "700",
      style: "italic"
    },
    {
      path: "../public/gilroy/Gilroy-ExtraBold.ttf",
      weight: "800",
      style: "normal"
    },
    {
      path: "../public/gilroy/Gilroy-ExtraBoldItalic.ttf",
      weight: "800",
      style: "italic"
    },
    {
      path: "../public/gilroy/Gilroy-Heavy.ttf",
      weight: "900",
      style: "normal"
    },
    {
      path: "../public/gilroy/Gilroy-HeavyItalic.ttf",
      weight: "900",
      style: "italic"
    },
    {
      path: "../public/gilroy/Gilroy-Light.ttf",
      weight: "300",
      style: "normal"
    },
    {
      path: "../public/gilroy/Gilroy-LightItalic.ttf",
      weight: "300",
      style: "italic"
    },
    {
      path: "../public/gilroy/Gilroy-Medium.ttf",
      weight: "500",
      style: "normal"
    },
    {
      path: "../public/gilroy/Gilroy-MediumItalic.ttf",
      weight: "500",
      style: "italic"
    },
    {
      path: "../public/gilroy/Gilroy-Regular.ttf",
      weight: "400",
      style: "normal"
    },
    {
      path: "../public/gilroy/Gilroy-RegularItalic.ttf",
      weight: "400",
      style: "italic"
    },
    {
      path: "../public/gilroy/Gilroy-SemiBold.ttf",
      weight: "600",
      style: "normal"
    },
    {
      path: "../public/gilroy/Gilroy-SemiBoldItalic.ttf",
      weight: "600",
      style: "italic"
    },
    {
      path: "../public/gilroy/Gilroy-Thin.ttf",
      weight: "100",
      style: "normal"
    },
    {
      path: "../public/gilroy/Gilroy-ThinItalic.ttf",
      weight: "100",
      style: "italic"
    },
    {
      path: "../public/gilroy/Gilroy-UltraLight.ttf",
      weight: "200",
      style: "normal"
    },
    {
      path: "../public/gilroy/Gilroy-UltraLightItalic.ttf",
      weight: "200",
      style: "italic"
    }
  ],
  display: 'swap'
});

export const metadata = {
  title: "SLBTS 2024",
  description: "Sri Sathya Sai Balvikas Talent Search 2024, Tamil Nadu",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${gilroy.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
