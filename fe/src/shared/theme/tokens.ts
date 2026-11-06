export const THEME_TOKENS = {
  colors: {
    background: '#0B0F19',
    surface: '#111827',
    surfaceElevated: '#1F2937',
    border: '#374151',
    borderSubtle: 'rgba(255, 255, 255, 0.08)',
    textPrimary: '#F9FAFB',
    textSecondary: '#9CA3AF',
    textMuted: '#6B7280',
    domains: {
      general: {
        primary: '#3B82F6', // Blue 500
        secondary: '#60A5FA',
        glow: 'rgba(59, 130, 246, 0.25)',
      },
      ai: {
        primary: '#A855F7', // Purple 500
        secondary: '#C084FC',
        glow: 'rgba(168, 85, 247, 0.25)',
      },
      game: {
        primary: '#10B981', // Emerald 500
        secondary: '#34D399',
        glow: 'rgba(16, 185, 129, 0.25)',
      },
    },
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    headings: 'font-bold tracking-tight',
  },
  glassmorphism: {
    base: 'backdrop-blur-md bg-white/5 border border-white/10 shadow-xl',
    card: 'backdrop-blur-lg bg-slate-900/60 border border-slate-700/60 rounded-2xl shadow-2xl',
  },
};
