function Camera()
{
    this.xPos = 0;
    this.yPos = 0;
    this.zPos = 250;

    this.speed = 0;
    this.theta = 0;
    this.phi = 0;

    this.LEFT_KEY = 37;
    this.UP_KEY = 38;
    this.RIGHT_KEY = 39;
    this.DOWN_KEY = 40;
}


Camera.prototype.handleCameraKeys = function handleKeys() {
    if (currentlyPressedKeys[this.LEFT_KEY]) {
        this.theta += 1;
    } else if (currentlyPressedKeys[this.RIGHT_KEY]) {
        this.theta += -1;
    }

    if (currentlyPressedKeys[87]) {
        // Up cursor key or W
        this.speed = 0.1;
    } else if (currentlyPressedKeys[83]) {
        // Down cursor key
        this.speed = -0.1;
    } else {
        this.speed = 0;
    }

    if(currentlyPressedKeys[this.UP_KEY])
    {
        this.phi += 1;
    }
    else if (currentlyPressedKeys[this.DOWN_KEY])
    {
        this.phi -= 1;
    }
}

Camera.prototype.update = function(delta)
{
    if (this.speed != 0)
    {
        this.zPos -= this.speed * delta;
    }

    if (this.thetaRate > 0)
    {
        this.xPos = this.zPos * Math.cos(degToRad(this.theta));
    }
}

Camera.prototype.move = function(modelViewMatrix)
{
    // mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(-this.pitch), [1, 0, 0]);
    mat4.translate(modelViewMatrix, modelViewMatrix, [-this.xPos, -this.yPos, -this.zPos]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(this.theta), [0, 1, 0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(this.phi), [0, 0, 1]);
}
