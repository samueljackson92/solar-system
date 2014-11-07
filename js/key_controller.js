var Keys = {
    LEFT_KEY: 37,
    UP_KEY: 38,
    RIGHT_KEY: 39,
    DOWN_KEY: 40,

    W_KEY: 87,
    S_KEY: 83,
    A_KEY: 65,
    D_KEY: 68,
    R_KEY: 82,
    F_KE: 70,
    X_KEY: 88,
    C_KEY: 67
};

function KeyController(){}

KeyController.prototype.handleKeyDown = function(event)
{
    camera.keyPressed(event.keyCode);
};

KeyController.prototype.handleKeyUp = function(event)
{
    camera.keyReleased(event.keyCode);
};
