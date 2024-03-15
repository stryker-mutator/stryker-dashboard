import { Meta, StoryObj } from '@storybook/web-components'

import '../../exports/lib/atoms/labeled-container'
import { html } from 'lit'

export default {
  title: 'Atoms/Labeled Container',
} as Meta

export const Default: StoryObj = {
  name: 'Default',
  render: () => html`
    <sme-labeled-container>Go Here!</sme-labeled-container>
  `,
}
