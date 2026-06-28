import type { Meta, StoryObj } from '@storybook/react';
import { BatchExpirySelector } from './BatchExpirySelector';

const batches = [
  { batchNo: 'A1', expiry: '2027-03-01', state: 'available', quantity: 20 },
  { batchNo: 'B2', expiry: '2026-08-01', state: 'low', quantity: 3 },
  { batchNo: 'C3', expiry: '2020-01-01', state: 'expired', quantity: 9 },
  { batchNo: 'D4', expiry: '2026-01-01', state: 'recalled', quantity: 6 },
] as const;

const meta: Meta<typeof BatchExpirySelector> = {
  title: 'Healthcare/BatchExpirySelector',
  component: BatchExpirySelector,
  args: { batches },
};
export default meta;
type Story = StoryObj<typeof BatchExpirySelector>;

export const Default: Story = {};
export const Loading: Story = { args: { batches: [], disabled: true } };
export const Empty: Story = { args: { batches: [] } };
export const Error: Story = { args: { batches: [batches[2]] } };
export const Disabled: Story = { args: { disabled: true } };
export const PermissionDenied: Story = { args: { disabled: true } };
export const Offline: Story = { args: { batches: [batches[0]] } };
export const HighRisk: Story = { args: { batches: [batches[3]] } };
export const Touch: Story = { args: { batches, value: 'A1' } };
export const Keyboard: Story = { args: { batches, value: 'B2' } };
