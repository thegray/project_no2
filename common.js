module.exports = function() {
    this.genRandomId = function() {
        return Math.random().toString(36).replace('0.', '');
    };
    this.getRandomArbitrary = function(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    };
    this.circleColliderCheck = function(c1, c2) {
        let collide = false;
        let dx = c1.x - c2.x;
        let dy = c1.y - c2.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        // console.log(`distance:  ${distance}, radius: ${(c1.getRadius()/2) + (c2.getRadius()/2)}`)
        if (distance < (c1.getRadius()/2) + (c2.getRadius()/2)) {
          collide = true;
        }
        return collide;
    };
  };
  