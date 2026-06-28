import type { Meta, StoryObj } from '@storybook/react';
import { StatusChip } from './StatusChip';

const meta: Meta<typeof StatusChip> = {
  title: 'Core/StatusChip',
  component: StatusChip,
  args: { domain: 'etims', status: 'transmitted' },
};
export default meta;
type Story = StoryObj<typeof StatusChip>;

export const Default: Story = {};
export const Loading: Story = { args: { domain: 'etims', status: 'pending' } };
export const Empty: Story = { args: { domain: 'claim', status: 'draft' } };
export const Error: Story = { args: { domain: 'etims', status: 'failed' } };
export const Disabled: Story = { args: { domain: 'mpesa', status: 'unpaid' } };
export const PermissionDenied: Story = { args: { domain: 'consent', status: 'required' } };
export const Offline: Story = { args: { domain: 'sync', status: 'offline' } };
export const HighRisk: Story = { args: { domain: 'consent', status: 'withdrawn' } };
export const Touch: Story = { args: { domain: 'mpesa', status: 'paid' } };
export const Keyboard: Story = { args: { domain: 'claim', status: 'submitted' } };
