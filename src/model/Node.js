export default class Node {
  constructor({
    id, coordinates = { x: 0, y: 0 }, properties = {}, items = [],
  }) {
    this.id = id;
    this.coordinates = coordinates;
    this.properties = properties;
    this.items = items;
  }

  getId() {
    return this.id;
  }

  getCoordinates() {
    return this.coordinates;
  }

  getProperties() {
    return this.properties;
  }

  getProperty(prop) {
    return this.properties[prop];
  }
}
