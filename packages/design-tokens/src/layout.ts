/** Layout dimension tokens for app shells. */
export const layout = {
  sidebarWidth: '264px',
  sidebarCollapsedWidth: '72px',
  headerHeight: '56px',
  posCartWidth: '380px',
} as const;

export type Layout = typeof layout;
