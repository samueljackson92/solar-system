function SphericalCamera()
{
    this.upVector = vec3.fromValues(0,1,0);
    this.position = vec3.fromValues(0,0,0);

    this.radius = 0;
    this.zoomRate = 0;

    this.cameraAngle = 0;

    this.theta = 0;
    this.thetaRate = 0;

    this.phi = 0;
    this.phiRate = 0;
}

SphericalCamera.prototype.keyPressed = function(key) {
    //zooming the camera in and out
    console.log(this.radius);
    if (key === Keys.W_KEY && this.radius > 1) {
        this.zoomRate = -2;
    } else if (key === Keys.S_KEY) {
        this.zoomRate = 2;
    } else {
        this.zoomRate = 0;
    }

    //rotating the camera along phi
    if(key === Keys.UP_KEY && this.phi <= 1) {
        this.phiRate = 0.05;
    } else if (key === Keys.DOWN_KEY && this.phi >= -1) {
        this.phiRate = -0.05;
    } else {
        this.phiRate = 0.0;
    }

    //rotating the camera along theta
    if(key === Keys.LEFT_KEY) {
        this.thetaRate = 0.05;
    } else if (key === Keys.RIGHT_KEY) {
        this.thetaRate = -0.05;
    }

};

SphericalCamera.prototype.keyReleased = function(key)
{
    if(key === Keys.W_KEY || key === Keys.S_KEY)
    {
        this.zoomRate = 0.0;
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
    this.radius += this.zoomRate;
    this.theta += this.thetaRate;
    this.phi += this.phiRate;
};

SphericalCamera.prototype.move = function(perspectiveMatrix)
{
    position = this.getCameraPosition();

    var m = mat4.create();
    mat4.lookAt(m, position, [0,0,0], this.upVector);
    mat4.multiply(perspectiveMatrix, perspectiveMatrix, m);
};

SphericalCamera.prototype.getCameraPosition = function()
{
    var position = vec3.create();
    var r = (this.radius > 0 ? this.radius : 1);
    position[0] = r * Math.sin(this.theta);
    position[1] = r * Math.sin(this.phi);
    position[2] = r * Math.cos(this.theta);
    return position;
};

SphericalCamera.prototype.setCameraPosition = function(position)
{
    var x = position[0];
    var y = position[1];
    var z = position[2];
    var length = vec3.length(position);

    this.radius = length;
    this.theta = Math.acos(z/length);
    this.phi = Math.atan2(y,x);
};
