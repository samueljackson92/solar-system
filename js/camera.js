function SphericalCamera()
{
    this.position = vec3.fromValues(0,0,0);

    this.xSpeed = 0;
    this.ySpeed = 0;
    this.zSpeed = 0;

    this.theta = 0;
    this.thetaRate = 0;

    this.phi = 0;
    this.phiRate = 0;

    this.yaw = 0;
    this.yawRate = 0;
}

SphericalCamera.prototype.keyPressed = function(key) {
    //moving on the z direction
    if (key === Keys.W_KEY) {
        this.zSpeed = 0.1;
    } else if (key === Keys.S_KEY) {
        this.zSpeed = -0.1;
    }

    if (key === Keys.A_KEY) {
        this.xSpeed = 0.1;
    } else if (key === Keys.D_KEY) {
        this.xSpeed = -0.1;
    }

    if (key === Keys.F_KEY) {
        this.ySpeed = 0.1;
    } else if (key === Keys.R_KEY) {
        this.ySpeed = -0.1;
    }

    if(key === Keys.UP_KEY) {
        this.phiRate = -1;
    } else if (key === Keys.DOWN_KEY) {
        this.phiRate = 1;
    }

    if(key === Keys.LEFT_KEY) {
        this.thetaRate = 1;
    } else if (key === Keys.RIGHT_KEY) {
        this.thetaRate = -1;
    }

};

SphericalCamera.prototype.keyReleased = function(key)
{
    if(key === Keys.W_KEY || key === Keys.S_KEY)
    {
        this.zSpeed = 0.0;
    }

    if(key === Keys.A_KEY || key === Keys.D_KEY)
    {
        this.xSpeed = 0.0;
    }

    if(key === Keys.F_KEY || key === Keys.R_KEY)
    {
        this.ySpeed = 0.0;
    }

    if(key === Keys.UP_KEY || key === Keys.DOWN_KEY)
    {
        this.phiRate = 0.0;
    }

    if(key === Keys.LEFT_KEY || key === Keys.RIGHT_KEY)
    {
        this.thetaRate = 0.0;
    }
};

SphericalCamera.prototype.update = function(delta)
{
    var velocity = vec3.fromValues(this.xSpeed, this.ySpeed, this.zSpeed);
    vec3.scale(velocity, velocity, delta);
    vec3.add(this.position, this.position, velocity);

    this.theta += this.thetaRate;
    this.phi += this.phiRate;
};

SphericalCamera.prototype.move = function(perspectiveMatrix)
{
    mat4.translate(perspectiveMatrix, perspectiveMatrix, this.position);
    mat4.rotate(perspectiveMatrix, perspectiveMatrix, degToRad(this.theta), [0, 1, 0]);
    mat4.rotate(perspectiveMatrix, perspectiveMatrix, degToRad(this.phi), [0, 0, 1]);
};

SphericalCamera.prototype.getCameraPosition = function()
{
    return this.position;
};

SphericalCamera.prototype.setCameraPosition = function(position)
{
    this.position = position;
    console.log(this.position);
};
