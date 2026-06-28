import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Core/Button',
  component: Button,
  args: { children: 'Action' },
};
export default meta;
type Story = StoryObj<typeof Button>;

// Required Module_10 story-state matrix.
export const Default: Story = {};
export const Loading: Story = { args: { loading: true } };
export const Empty: Story = { args: { children: '' } };
export const Error: Story = { args: { variant: 'danger', children: 'Delete' } };
export const Disabled: Story = { args: { disabled: true } };
export const PermissionDenied: Story = { args: { permissionDenied: true, children: 'Approve' } };
export const Offline: Story = { args: { variant: 'secondary', children: 'Retry sync' } };
export const HighRisk: Story = { args: { variant: 'danger', children: 'Override clinical warning' } };
export const Touch: Story = { args: { size: 'pos', children: 'Pay' } };
export const Keyboard: Story = { args: { children: 'Tab to me', autoFocus: true } };
