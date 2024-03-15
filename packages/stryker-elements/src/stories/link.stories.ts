import { Meta, StoryObj } from '@storybook/web-components'

import '../exports/lib/atoms/link'
import { html } from 'lit'

export default {
  title: 'Link Element',
} as Meta

export const Default: StoryObj = {
  name: 'Primary Link',
  render: () => html`
    <sme-link primary>Go Here!</sme-link>
  `,
}

export const Secondary: StoryObj = {
  name: 'Primary Link',
  render: () => html`
    <sme-link secondary>Go Here!</sme-link>
  `,
}
