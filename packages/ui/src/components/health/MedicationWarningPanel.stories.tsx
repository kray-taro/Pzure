import type { Meta, StoryObj } from '@storybook/react';
import { MedicationWarningPanel } from './MedicationWarningPanel';

const meta: Meta<typeof MedicationWarningPanel> = {
  title: 'Healthcare/MedicationWarningPanel',
  component: MedicationWarningPanel,
  args: { warnings: [{ id: '1', severity: 'warning', message: 'Reduce dose for renal impairment' }] },
};
export default meta;
type Story = StoryObj<typeof MedicationWarningPanel>;

export const Default: Story = {};
export const Loading: Story = { args: { warnings: [] } };
export const Empty: Story = { args: { warnings: [] } };
export const Error: Story = { args: { warnings: [{ id: '1', severity: 'critical', message: 'Contraindicated' }] } };
export const Disabled: Story = { args: { warnings: [{ id: '1', severity: 'normal', message: 'No action' }] } };
export const PermissionDenied: Story = { args: { warnings: [{ id: '1', severity: 'normal', message: 'Hidden detail' }] } };
export const Offline: Story = { args: { warnings: [{ id: '1', severity: 'warning', message: 'Cached check' }] } };
export const HighRisk: Story = { args: { warnings: [{ id: '1', severity: 'critical', message: 'Severe interaction with current meds' }] } };
export const Touch: Story = { args: { warnings: [{ id: '1', severity: 'warning', message: 'Tap to acknowledge' }] } };
export const Keyboard: Story = { args: { warnings: [{ id: '1', severity: 'normal', message: 'Use arrow keys' }] } };
