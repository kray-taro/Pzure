import type { Meta, StoryObj } from '@storybook/react';
import { AllergyBanner } from './AllergyBanner';

const meta: Meta<typeof AllergyBanner> = {
  title: 'Healthcare/AllergyBanner',
  component: AllergyBanner,
  args: { allergies: ['Penicillin'] },
};
export default meta;
type Story = StoryObj<typeof AllergyBanner>;

export const Default: Story = {};
export const Loading: Story = { args: { allergies: [] } };
export const Empty: Story = { args: { allergies: [] } };
export const Error: Story = { args: { allergies: ['Unknown reaction logged'] } };
export const Disabled: Story = { args: { allergies: ['Penicillin'], 'aria-disabled': true } };
export const PermissionDenied: Story = { args: { allergies: ['Redacted'] } };
export const Offline: Story = { args: { allergies: ['Penicillin (cached)'] } };
export const HighRisk: Story = { args: { allergies: ['Penicillin', 'Latex', 'Contrast dye'] } };
export const Touch: Story = { args: { allergies: ['Aspirin'] } };
export const Keyboard: Story = { args: { allergies: ['Sulfa'] } };
