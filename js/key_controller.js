var Keys = {
    LEFT_KEY: 37,
    UP_KEY: 38,
    RIGHT_KEY: 39,
    DOWN_KEY: 40,

    Q_KEY: 81,
    W_KEY: 87,
    S_KEY: 83,

    F1_KEY:	112,
    F2_KEY:	113,
    F3_KEY:	114,
    F4_KEY:	115,
    F5_KEY:	116,
    F6_KEY:	117,
    F7_KEY:	118,
    F8_KEY:	119,
    F9_KEY:	120,
    F10_KEY: 121,
    F11_KEY: 122,
    F12_KEY: 123,

    NUM0_KEY:	48,
    NUM1_KEY:	49,
    NUM2_KEY:	50,
    NUM3_KEY:	51,
    NUM4_KEY:	52,
    NUM5_KEY:	53,
    NUM6_KEY:	54,
    NUM7_KEY:	55,
    NUM8_KEY:	56,
    NUM9_KEY:	57
};

function KeyController(){}

KeyController.prototype.handleKeyDown = function(event)
{
    var key = event.keyCode;
    camera.keyPressed(key);


    if(key >= Keys.F1_KEY && key <= Keys.F12_KEY)
    {
        var index = key - Keys.F1_KEY;
        if (index < majorPlanets.length)
        {
            camera.setFocussedObject(majorPlanets[index]);
        }
    }
};

KeyController.prototype.handleKeyUp = function(event)
{
    camera.keyReleased(event.keyCode);
};
