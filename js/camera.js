function Camera()
{
    this.xPos = 0;
    this.yPos = 0;
    this.zPos = 250;

    this.position = vec3.fromValues(0,0,0);

    this.speed = 0;
    this.theta = 0;
    this.phi = 0;

    this.yaw = 0;
    this.yawRate = 0;

    this.LEFT_KEY = 37;
    this.UP_KEY = 38;
    this.RIGHT_KEY = 39;
    this.DOWN_KEY = 40;

    this.W_KEY = 87;
    this.S_KEY = 83;
    this.A_KEY = 65;
    this.D_KEY = 68;
}



Camera.prototype.handleCameraKeys = function handleKeys() {
    if (currentlyPressedKeys[this.LEFT_KEY]) {
        this.theta += 1;
    } else if (currentlyPressedKeys[this.RIGHT_KEY]) {
        this.theta += -1;
    }

    if (currentlyPressedKeys[this.W_KEY]) {
        this.speed = 0.1;
    } else if (currentlyPressedKeys[this.S_KEY]) {
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

    if(currentlyPressedKeys[this.A_KEY])
    {
        this.yaw += 1;
    }
    else if (currentlyPressedKeys[this.D_KEY])
    {
        this.yaw -= 1;
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

Camera.prototype.move = function(perspectiveMatrix)
{
    this.position = vec3.fromValues(-this.xPos, -this.yPos, -this.zPos);
    mat4.rotate(perspectiveMatrix, perspectiveMatrix, degToRad(-this.yaw), [0, 1, 0]);
    mat4.translate(perspectiveMatrix, perspectiveMatrix, this.position);
    mat4.rotate(perspectiveMatrix, perspectiveMatrix, degToRad(this.theta), [0, 1, 0]);
    mat4.rotate(perspectiveMatrix, perspectiveMatrix, degToRad(this.phi), [0, 0, 1]);
}

Camera.prototype.getCameraPosition = function()
{
    return this.position;
}
