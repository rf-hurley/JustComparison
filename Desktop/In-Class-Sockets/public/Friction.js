applyFriction(friction){
    let f = p5.Vector.div(friction, this.mass);
    this.acceleration.add(f)
}


calcFriction(){
     // Magnitude is coefficient * speed squared
    let speed = this.velocity.mag();
    let dragMagnitude = this.fc;
      
    // Direction is inverse of velocity
    let dragForce = this.velocity.copy();
     dragForce.mult(-1);
      
    // Scale according to magnitude
    // dragForce.setMag(dragMagnitude);
    // dragForce.normalize();
    // dragForce.mult(dragMagnitude);
    return dragForce;
     
}