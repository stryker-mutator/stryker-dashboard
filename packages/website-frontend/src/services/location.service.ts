export class LocationService {
  public getLocation(): Location {
    return window.location;
  }
}

export const locationService = new LocationService();
