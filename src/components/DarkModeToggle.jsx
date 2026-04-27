function DarkModeToggle({ theme, setTheme }) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="fixed right-4 top-4 z-50 border border-app-border bg-app-surface p-2 text-app-text shadow-sm transition-colors duration-200 ease-in-out"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle color theme"
    >
      {isDark ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M21 12.79A9 9 0 1 1 11.21 3c0 .26-.01.52-.01.79A9 9 0 0 0 21 12.79Z" />
        </svg>
      )}
    </button>
  );
}

export default DarkModeToggle;
