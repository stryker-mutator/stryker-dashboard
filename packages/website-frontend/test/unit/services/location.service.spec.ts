import { LocationService, locationService } from '../../../src/services/location.service';

describe(LocationService.name, () => {
  it('should return an instance of Location', () => {
    expect(locationService.getLocation()).to.be.instanceOf(Location);
  });
});
