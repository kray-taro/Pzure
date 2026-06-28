import type { Meta, StoryObj } from '@storybook/react';
import { RecalledBatchAlert } from './RecalledBatchAlert';

const meta: Meta<typeof RecalledBatchAlert> = {
  title: 'Healthcare/RecalledBatchAlert',
  component: RecalledBatchAlert,
  args: { drug: 'Amoxicillin', batchNo: 'B7', reason: 'Possible contamination' },
};
export default meta;
type Story = StoryObj<typeof RecalledBatchAlert>;

export const Default: Story = {};
export const Loading: Story = { args: { reason: 'Verifying recall…' } };
export const Empty: Story = { args: { reason: 'No reason supplied' } };
export const Error: Story = { args: { reason: 'Failed to load recall detail' } };
export const Disabled: Story = { args: { 'aria-disabled': true } };
export const PermissionDenied: Story = { args: { reason: 'Detail restricted' } };
export const Offline: Story = { args: { reason: 'Recall list cached offline' } };
export const HighRisk: Story = { args: { reason: 'Class I recall – serious adverse events' } };
export const Touch: Story = { args: { drug: 'Insulin', batchNo: 'INS-22' } };
export const Keyboard: Story = { args: { drug: 'Warfarin', batchNo: 'WF-09' } };
