import { render, type RenderOptions } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { type ReactElement } from "react";

// Default test messages
const defaultMessages = {
  site: {
    title: "QuakeOverlay",
    description: "Test description",
  },
  nav: {
    home: "Home",
    docs: "Docs",
    releases: "Releases",
  },
  home: {
    heroTitle: "Never miss earthquake information during your stream.",
    heroSubtitle: "QuakeOverlay automatically fetches earthquake data\nand displays it on your OBS stream overlay.\nStay informed and share earthquake information with your viewers during streams.",
    ctaDownload: "Download",
    ctaDocs: "View Docs",
    hero: {
      badge: "For OBS Streamers",
      screenshotAlt: "QuakeOverlay main screen",
    },
    features: {
      title: "Key Features",
      subtitle: "Everything you need for earthquake info on stream",
      items: {
        realtime: {
          title: "Earthquake Alerts",
          description: "Automatically fetches earthquake data and displays it on your stream overlay. Keep your viewers informed during streams.",
        },
        overlay: {
          title: "OBS Overlay",
          description: "Easily add as a browser source in OBS.",
        },
        customize: {
          title: "Customization",
          description: "Fine-tune display position, size, and more.",
        },
        multilang: {
          title: "Multi-language",
          description: "Supports Japanese, English, and Korean.",
        },
      },
    },
    demo: {
      title: "Demo",
      subtitle: "See it in action",
      items: {
        main: { caption: "Main screen - Earthquake information display" },
        dashboard: { caption: "Dashboard" },
        overlay: { caption: "OBS overlay example" },
        receiveLog: { caption: "Receive Log" },
        overlaySettings: { caption: "Earthquake Notification Overlay Settings" },
        mapSettings: { caption: "Map Display Settings" },
        settings: { caption: "Settings - Fine-grained customization" },
      },
    },
    howItWorks: {
      title: "Easy 3 Steps",
      subtitle: "Setup takes just minutes",
      steps: {
        download: {
          title: "Download",
          description: "Download from Booth and extract the ZIP.",
        },
        configure: {
          title: "Configure",
          description: "Launch the app and set your preferences.",
        },
        stream: {
          title: "Start Streaming",
          description: "Add a browser source in OBS and set the URL.",
        },
      },
    },
    reviews: {
      title: "User Reviews",
      subtitle: "What users are saying about QuakeOverlay",
      empty: "Reviews coming soon",
    },
    cta: {
      title: "Get Started Now",
      subtitle: "Download and display earthquake info on your stream",
      download: "Download on Booth",
    },
  },
  header: {
    skipToContent: "Skip to content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    languageSwitcher: "Language",
    currentLanguage: "English",
  },
  footer: {
    copyright: "© {year} QuakeOverlay. All rights reserved.",
    description: "Earthquake information overlay for streaming",
    documents: "Documents",
    links: "Links",
    language: "Language",
    gettingStarted: "Getting Started",
    screens: "Screens",
    faq: "FAQ",
    support: "Support",
  },
  docs: {
    title: "Documentation",
    searchPlaceholder: "Search docs…",
    noResults: "No documents found",
    tableOfContents: "Table of Contents",
    onThisPage: "On this page",
    previousPage: "Previous",
    nextPage: "Next",
    breadcrumb: {
      home: "Home",
      docs: "Docs",
    },
    categories: {
      "getting-started": "Getting Started",
      screens: "Screens",
      customization: "Customization",
      faq: "FAQ",
      support: "Support",
    },
    sidebar: "Sidebar",
    openSidebar: "Open sidebar",
    closeSidebar: "Close sidebar",
    searchResultCount: "{count} results",
    searchMatchBody: "Match in body",
    noResultsHint:
      "Searching titles, descriptions, and body text. Try a different or shorter keyword.",
  },
  releases: {
    title: "Release Notes",
    subtitle: "QuakeOverlay update history",
    filterAll: "All",
    changeTypes: {
      feature: "Feature",
      improvement: "Improvement",
      fix: "Fix",
      breaking: "Breaking",
    },
    knownIssues: "Known Issues",
    noReleases: "No releases yet",
    detail: {
      backToList: "Back to Release Notes",
    },
    breadcrumb: {
      home: "Home",
      releases: "Releases",
    },
    roadmap: {
      title: "Roadmap",
      subtitle: "Upcoming development plans",
      targetVersion: "Target version",
      statuses: {
        planned: "Planned",
        "in-progress": "In Progress",
        completed: "Completed",
      },
      noItems: "No roadmap items yet",
    },
  },
  loading: {
    text: "Loading…",
    ariaLabel: "Loading content",
  },
  accessibility: {
    mainContent: "Main content",
  },
};

type CustomRenderOptions = Omit<RenderOptions, "wrapper"> & {
  locale?: string;
  messages?: Record<string, unknown>;
};

function customRender(
  ui: ReactElement,
  {
    locale = "en",
    messages = defaultMessages,
    ...options
  }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

export { customRender as render };
export { defaultMessages };
export { screen, within, waitFor, act } from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
