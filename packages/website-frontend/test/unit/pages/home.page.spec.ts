import '@stryker-mutator/stryker-elements';

import { HomePage } from '../../../src/pages/home.page';
import { CustomElementFixture } from '../../helpers/custom-element-fixture';

describe(HomePage.name, () => {
  let sut: CustomElementFixture<HomePage>;

  beforeEach(() => {
    sut = new CustomElementFixture('stryker-dashboard-home-page', { autoConnect: true });
  });

  afterEach(() => {
    sut.dispose();
  });

  it('should be of the correct instance', () => {
    // Assert
    expect(sut.element).to.be.instanceOf(HomePage);
  });

  it('should render correctly', async () => {
    // Act
    await sut.whenStable();

    // Assert
    expect(sut.element.querySelector('sme-hero')).toBeInTheDocument();
    expect(sut.element.querySelector('sme-stryker-dashboard-explanation')).toBeInTheDocument();

    const gettingStarted = sut.element.querySelector('sme-getting-started-overview');

    expect(gettingStarted).toBeInTheDocument();
  });

  it('should navigate to overview when clicking on "getting started"', async () => {
    // Arrange
    await sut.whenStable();

    // Act
    const link = sut.element.querySelector('sme-hero')?.shadowRoot?.querySelector('sme-link');

    // Assert
    expect(link).toHaveAttribute('href', '#getting-started');
  });

  // Test if the names of the supported frameworks are displayed
  it('should display all supported frameworks', async () => {
    // Arrange
    await sut.whenStable();

    // Act
    const supportedFrameworkList = sut.element.querySelector('sme-supported-framework-list');

    // Assert
    expect(supportedFrameworkList).toBeInTheDocument();
    const supportedFrameworks = supportedFrameworkList?.shadowRoot?.querySelectorAll('sme-supported-framework')
    expect(supportedFrameworks).toHaveLength(4);
    expect(supportedFrameworks?.[0]).toHaveAttribute('name', 'StrykerJS');
    expect(supportedFrameworks?.[1]).toHaveAttribute('name', 'Stryker.NET');
    expect(supportedFrameworks?.[2]).toHaveAttribute('name', 'Stryker4s');
    expect(supportedFrameworks?.[3]).toHaveAttribute('name', 'Infection');
  });
});
