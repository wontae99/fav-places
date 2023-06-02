export class Place {
  constructor(title, imgUri, location, id) {
    this.title = title;
    this.imgUri = imgUri;
    this.address = location.address;
    this.location = {
      lat: location.lat,
      long: location.long,
    }; // {lat: x, long: y}
    this.id = id;
  }
}
