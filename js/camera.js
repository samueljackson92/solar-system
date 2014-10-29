function Camera()
{
    this.xPos = 0;
    this.yPos = 0;
    this.zPos = 250;

    this.position = vec3.fromValues(0,0,0);

    this.xSpeed = 0;
    this.ySpeed = 0;
    this.zSpeed = 0;

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
    this.R_KEY = 82;
    this.F_KEY = 70;
    this.X_KEY = 88;
    this.C_KEY = 67;
}



Camera.prototype.handleCameraKeys = function handleKeys() {
    //moving on the z direction
    if (currentlyPressedKeys[this.W_KEY]) {
        this.zSpeed = 0.1;
    } else if (currentlyPressedKeys[this.S_KEY]) {
        this.zSpeed = -0.1;
    } else {
        this.zSpeed = 0;
    }

    if (currentlyPressedKeys[this.A_KEY]) {
        this.xSpeed = 0.1;
    } else if (currentlyPressedKeys[this.D_KEY]) {
        this.xSpeed = -0.1;
    } else {
        this.xSpeed = 0;
    }

    if (currentlyPressedKeys[this.F_KEY]) {
        this.ySpeed = 0.1;
    } else if (currentlyPressedKeys[this.R_KEY]) {
        this.ySpeed = -0.1;
    } else {
        this.ySpeed = 0;
    }

    if(currentlyPressedKeys[this.UP_KEY])
    {
        this.phi -= 1;
    }
    else if (currentlyPressedKeys[this.DOWN_KEY])
    {
        this.phi += 1;
    }

    if(currentlyPressedKeys[this.LEFT_KEY])
    {
        this.theta += 1;
    }
    else if (currentlyPressedKeys[this.RIGHT_KEY])
    {
        this.theta -= 1;
    }

    if(currentlyPressedKeys[this.X_KEY])
    {
        this.yaw -= 1;
    }
    else if (currentlyPressedKeys[this.C_KEY])
    {
        this.yaw += 1;
    }
}

Camera.prototype.update = function(delta)
{
    var speed = vec3.fromValues(this.xSpeed, this.ySpeed, this.zSpeed);
    vec3.scale(speed, speed, delta);
    vec3.add(this.position, this.position, speed);

    var r = vec3.length(this.position);
    this.xPos = r * Math.cos(degToRad(this.theta)) * Math.sin(degToRad(this.phi));
    this.yPos = r * Math.sin(degToRad(this.theta)) * Math.sin(degToRad(this.phi));
    this.zPos = r * Math.cos(degToRad(this.phi));
}

Camera.prototype.move = function(perspectiveMatrix)
{
    mat4.rotate(perspectiveMatrix, perspectiveMatrix, degToRad(this.yaw), [0, 1, 0]);
    mat4.translate(perspectiveMatrix, perspectiveMatrix, this.position);
    mat4.rotate(perspectiveMatrix, perspectiveMatrix, degToRad(this.theta), [0, 1, 0]);
    mat4.rotate(perspectiveMatrix, perspectiveMatrix, degToRad(this.phi), [0, 0, 1]);
}

Camera.prototype.getCameraPosition = function()
{
    return this.position;
}
