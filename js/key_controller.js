function KeyController()
{
    this.currentlyPressedKeys = {};

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

KeyController.prototype.handleKeys = function()
{
    camera.handleCameraKeys();
};

KeyController.prototype.isPressed = function(key)
{
    return this.currentlyPressedKeys[key];
};

KeyController.prototype.handleKeyDown = function(event)
{
    this.currentlyPressedKeys[event.keyCode] = true;
};

KeyController.prototype.handleKeyUp = function(event)
{
    this.currentlyPressedKeys[event.keyCode] = false;
};
