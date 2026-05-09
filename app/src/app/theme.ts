import type { ThemeConfig } from 'antd';

// Ant Design 5 theme override (PRD §5 design tokens).
// Mirrors the look of the audited site: gray-900 primary, pill radii, Manrope font.
export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: '#393939',
    colorText: 'rgba(0, 0, 0, 0.85)',
    colorTextSecondary: 'rgba(0, 0, 0, 0.65)',
    colorBgContainer: '#ffffff',
    colorBgLayout: '#ffffff',
    colorBorder: '#dedede',
    colorBorderSecondary: '#f0f0f0',
    fontFamily:
      'Manrope, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 14,
    borderRadius: 2,
    borderRadiusLG: 4,
    controlHeight: 40,
    controlHeightLG: 48,
  },
  components: {
    Button: {
      // Primary CTA buttons in the wizard are tall + pill-shaped.
      borderRadius: 4,
      fontWeight: 600,
      controlHeightLG: 56,
      paddingInlineLG: 32,
    },
    Input: {
      borderRadius: 4,
    },
    Modal: {
      borderRadiusLG: 8,
    },
    Dropdown: {
      borderRadiusLG: 8,
    },
    Notification: {
      borderRadiusLG: 8,
    },
  },
};
