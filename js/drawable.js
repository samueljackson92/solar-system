/*
Drawable defines a common interface for drawable objects in the scene.
Objects that implement Drawable must declare:
    - draw :: a function that defines how to draw the object
    - animate :: a function that animates the object (optional)
    - getChildren :: return a list of children that are also drawables.
    - addChild :: a function to add child drawables to this object.
*/

function Drawable(texture, isLightSource)
{

    //texture object defining look of the body
    this.texture = texture;

    // data arrays for vertices, normals etc.
    this.vertexPositionData = [];
    this.normalData = [];
    this.textureCoordinateData = [];
    this.indexData = [];
    this.fullyLit = false;
    this.positionVector = vec3.fromValues(0,0,0);
    
    this.isLightSource = (isLightSource !== undefined && isLightSource !== false);
}

Drawable.prototype.initBuffers = function()
{
    this.vertexPositionBuffer = createArrayBuffer(this.vertexPositionData, 3);
    this.vertexTextureCoordinateBuffer = createArrayBuffer(this.textureCoordinateData, 2);
    this.vertexNormalBuffer = createArrayBuffer(this.normalData, 3);
    this.vertexIndexBuffer = createElementArrayBuffer(this.indexData, 1);
}

Drawable.prototype.setPositionVector = function(position)
{
    this.positionVector = position;
}
