import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Core/Input',
  component: Input,
  args: { label: 'Patient name' },
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};
export const Loading: Story = { args: { placeholder: 'Loading…', disabled: true } };
export const Empty: Story = { args: { value: '', placeholder: 'Enter name' } };
export const Error: Story = { args: { errorMessage: 'Name is required' } };
export const Disabled: Story = { args: { disabled: true } };
export const PermissionDenied: Story = { args: { disabled: true, label: 'Restricted field' } };
export const Offline: Story = { args: { label: 'Saved locally', placeholder: 'Offline draft' } };
export const HighRisk: Story = { args: { label: 'Dose (mg)', type: 'number', errorMessage: 'Exceeds max safe dose' } };
export const Touch: Story = { args: { label: 'Barcode', placeholder: 'Scan' } };
export const Keyboard: Story = { args: { label: 'Search', hideLabel: true, autoFocus: true } };
