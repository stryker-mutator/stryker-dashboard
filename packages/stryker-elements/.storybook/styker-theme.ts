import { create } from '@storybook/theming/create'

export default create({
  base: 'dark',
  brandTitle: `
    <div style="display:grid;grid-template-columns:25px 1fr;grid-gap:5px;align-items:center;">
      <img src="https://stryker-mutator.io/images/stryker.svg" width="25px" /> 
      <span>Stryker</span>
    </div>
  `,
  brandUrl: 'https://github.com/stryker-mutator/stryker-dashboard',
  brandTarget: '_blank',
})
