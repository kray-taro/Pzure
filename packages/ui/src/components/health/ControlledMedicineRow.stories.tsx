import type { Meta, StoryObj } from '@storybook/react';
import { ControlledMedicineRow } from './ControlledMedicineRow';

const meta: Meta<typeof ControlledMedicineRow> = {
  title: 'Healthcare/ControlledMedicineRow',
  component: ControlledMedicineRow,
  args: { drug: 'Morphine', schedule: 'CD2', balance: 12, dispensedBy: 'RN Achieng', witnessed: true },
  decorators: [
    (Story) => (
      <table><tbody><Story /></tbody></table>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof ControlledMedicineRow>;

export const Default: Story = {};
export const Loading: Story = { args: { dispensedBy: '…' } };
export const Empty: Story = { args: { balance: 0 } };
export const Error: Story = { args: { witnessed: false } };
export const Disabled: Story = { args: { 'aria-disabled': true } };
export const PermissionDenied: Story = { args: { dispensedBy: 'Restricted' } };
export const Offline: Story = { args: { dispensedBy: 'RN (offline)' } };
export const HighRisk: Story = { args: { schedule: 'CD2', witnessed: false } };
export const Touch: Story = { args: { drug: 'Pethidine' } };
export const Keyboard: Story = { args: { drug: 'Fentanyl' } };
