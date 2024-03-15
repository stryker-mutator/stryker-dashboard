import { Meta, StoryObj } from '@storybook/web-components'

import '../../exports/lib/atoms/progress-bar'
import { html } from 'lit'

export default {
  title: 'Atoms/Progress Bar',
  component: 'sme-progress-bar',
  render: ({ currentStep, totalSteps }) => html`
    <progress-bar
      class="col-span-2"
      currentStep="${currentStep}"
      totalSteps="${totalSteps}"
    ></progress-bar>
  `,
} as Meta

export const Default: StoryObj = {
  name: 'Progress Bar Passing',
  args: {
    currentStep: 900,
    totalSteps: 1000,
  },
}

export const Warning: StoryObj = {
  name: 'Progress Bar Warning',
  args: {
    currentStep: 700,
    totalSteps: 1000,
  },
}

export const Failing: StoryObj = {
  name: 'Progress Bar Failing',
  args: {
    currentStep: 100,
    totalSteps: 1000,
  },
}
