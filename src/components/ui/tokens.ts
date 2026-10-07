/**
 * Cliniq Design System Tokens
 * 
 * Centralized aesthetic rules to avoid arbitrary visual fragments.
 * Adheres strictly to the 60-30-10 color rule, zero-pill discipline, and calm healthcare tech visual identity.
 */

export const tokens = {
  colors: {
    // 60% Dominant Neutral Canvas
    canvas: {
      background: '#FAF9F5', // Warm off-white
      surface: '#FFFFFF',    // Crisp container white
      muted: '#F5F4EE',      // Subtle alternate row background
      subtle: '#EFEFEA',     // Delicate divider background
    },
    // 30% Structural Surfaces & Typography
    text: {
      primary: '#1A1C1A',    // Dark warm graphite
      secondary: '#525A56',  // Readable slate-olive body
      muted: '#838A87',      // Muted metadata
      inverse: '#FFFFFF',
    },
    border: {
      hairline: '#E6E5DE',   // 1px hairline border
      subtle: '#EFEFE9',
      focus: '#0F5A47',
    },
    // 10% Intentional Accent Budget
    brand: {
      primary: '#0F5A47',    // Deep sophisticated teal
      hover: '#0C4738',
      active: '#08362B',
      light: '#E8F3EE',      // Soft emerald tint
      tint: '#F4F9F6',
    },
    semantic: {
      success: '#10B981',    // Confirmed / active
      successBg: '#E8F3EE',
      warning: '#B45309',    // Pending / awaiting
      warningBg: '#FEF9C3',
      error: '#DC2626',      // Cancelled / reported
      errorBg: '#FEE2E2',
      info: '#0284C7',
      infoBg: '#E0F2FE',
    }
  },
  radii: {
    sm: '0.5rem',    // 8px - chips/subtle buttons
    md: '0.75rem',   // 12px - controls/inputs
    lg: '1rem',      // 16px - cards
    xl: '1.5rem',    // 24px - modal/top banners
    full: '9999px',
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  transitions: {
    default: '180ms cubic-bezier(0.16, 1, 0.3, 1)',
    smooth: '320ms cubic-bezier(0.16, 1, 0.3, 1)',
  }
} as const;
