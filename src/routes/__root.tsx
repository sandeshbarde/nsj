import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShopProvider } from "@/lib/store";
import { CatalogProvider } from "@/lib/catalog";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-6xl">404</h1>

        <h2 className="mt-4 text-xl">
          Page not found
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/"
          className="mt-6 inline-block bg-ink px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-ink-foreground"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.error("NSJ Root Error:", error);

  const router = useRouter();

  useEffect(() => {
    console.error("NSJ Application Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl">
          This page didn't load
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong while loading NSJ Jewellery.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="bg-ink px-6 py-3 text-[11px] tracking-[0.2em] uppercase text-ink-foreground"
          >
            Try Again
          </button>

          <a
            href="/"
            className="border border-foreground px-6 py-3 text-[11px] tracking-[0.2em] uppercase"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route =
  createRootRouteWithContext<{
    queryClient: QueryClient;
  }>()({
    head: () => ({
      meta: [
        {
          charSet: "utf-8",
        },

        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },

        {
          title: "NSJ Jewellery",
        },

        {
          name: "description",
          content:
            "NSJ Jewellery - Premium jewellery collection with elegant designs and timeless craftsmanship.",
        },

        {
          property: "og:title",
          content: "NSJ Jewellery",
        },

        {
          property: "og:description",
          content:
            "Discover premium jewellery collections from NSJ Jewellery.",
        },

        {
          property: "og:type",
          content: "website",
        },

        {
          name: "twitter:card",
          content: "summary_large_image",
        },
      ],

      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },

        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },

        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },

        {
          rel: "stylesheet",
          href:
            "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@300;400;500&display=swap",
        },

        {
          rel: "icon",
          href: "/favicon.ico",
          type: "image/x-icon",
        },
      ],
    }),

    shellComponent: RootShell,

    component: RootComponent,

    notFoundComponent: NotFoundComponent,

    errorComponent: ErrorComponent,
  });

function RootShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>

      <body>
        {children}

        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <CatalogProvider>
      <ShopProvider>
        <Header />

        <main className="min-h-[50vh]">
          <Outlet />
        </main>

        <Footer />

        <Toaster position="bottom-right" />
      </ShopProvider>
      </CatalogProvider>
    </QueryClientProvider>
  );
}
