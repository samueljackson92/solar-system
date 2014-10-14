function Camera()
{
    this.pitch = 0;
    this.pitchRate = 0;

    this.yaw = 0;
    this.yawRate = 0;

    this.xPos = 0;
    this.yPos = 0;
    this.zPos = 0;

    this.speed = 0;
}


Camera.prototype.handleCameraKeys = function handleKeys() {
    if (currentlyPressedKeys[33]) {
        // Page Up
        this.pitchRate = 0.1;
    } else if (currentlyPressedKeys[34]) {
        // Page Down
        this.pitchRate = -0.1;
    } else {
        this.pitchRate = 0;
    }

    if (currentlyPressedKeys[37] || currentlyPressedKeys[65]) {
        // Left cursor key or A
        this.yawRate = 0.1;
    } else if (currentlyPressedKeys[39] || currentlyPressedKeys[68]) {
        // Right cursor key or D
        this.yawRate = -0.1;
    } else {
        this.yawRate = 0;
    }

    if (currentlyPressedKeys[38] || currentlyPressedKeys[87]) {
        // Up cursor key or W
        this.speed = 0.005;
    } else if (currentlyPressedKeys[40] || currentlyPressedKeys[83]) {
        // Down cursor key
        this.speed = -0.005;
    } else {
        this.speed = 0;
    }

}

Camera.prototype.update = function(delta)
{
    if (this.speed != 0)
    {
        this.xPos -= Math.sin(degToRad(this.yaw)) * this.speed * delta;
        this.zPos -= Math.cos(degToRad(this.yaw)) * this.speed * delta;
    }

    this.yaw += this.yawRate * delta;
    this.pitch += this.pitchRate * delta;
}

Camera.prototype.move = function(modelViewMatrix)
{
    mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(-this.pitch), [1, 0, 0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(-this.yaw), [0, 1, 0]);
    mat4.translate(modelViewMatrix, modelViewMatrix, [-this.xPos, -this.yPos, -this.zPos]);
}
