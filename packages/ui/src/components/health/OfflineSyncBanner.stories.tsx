import type { Meta, StoryObj } from '@storybook/react';
import { OfflineSyncBanner } from './OfflineSyncBanner';

const meta: Meta<typeof OfflineSyncBanner> = {
  title: 'Healthcare/OfflineSyncBanner',
  component: OfflineSyncBanner,
  args: { state: 'online' },
};
export default meta;
type Story = StoryObj<typeof OfflineSyncBanner>;

export const Default: Story = {};
export const Loading: Story = { args: { state: 'queued' } };
export const Empty: Story = { args: { state: 'online', pending: 0 } };
export const Error: Story = { args: { state: 'conflict' } };
export const Disabled: Story = { args: { state: 'offline', 'aria-disabled': true } };
export const PermissionDenied: Story = { args: { state: 'offline' } };
export const Offline: Story = { args: { state: 'offline', pending: 12 } };
export const HighRisk: Story = { args: { state: 'conflict', pending: 3 } };
export const Touch: Story = { args: { state: 'queued', pending: 4 } };
export const Keyboard: Story = { args: { state: 'online' } };
