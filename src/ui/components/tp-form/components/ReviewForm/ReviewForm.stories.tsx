import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {ReviewForm} from './ReviewForm';

const meta: Meta<typeof ReviewForm> = {
  component: ReviewForm,
};

export default meta;

type Story = StoryObj<typeof ReviewForm>;

export const Basic: Story = {args: {}};
