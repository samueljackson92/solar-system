function SceneGraph()
{
    this.matrixStack = [];
    this.drawableObjects = [];
    this.blendingBuffer = [];
}

SceneGraph.prototype.push = function(matrix)
{
    var copy = mat4.clone(matrix);
    this.matrixStack.push(copy);
};

SceneGraph.prototype.pop = function()
{
    if(this.matrixStack.length === 0)
    {
        throw "SceneGraph: Matrix stack is empty!";
    }
    return this.matrixStack.pop();
};

SceneGraph.prototype.addDrawableObject = function(drawable)
{
    this.drawableObjects.push(drawable);
};

SceneGraph.prototype.drawScene = function(modelViewMatrix)
{
    this.drawObjects(this.drawableObjects, modelViewMatrix);
    this.renderBlendingBuffer();
};

SceneGraph.prototype.renderBlendingBuffer = function()
{
    while (this.blendingBuffer.length > 0)
    {
        var blendedItem = this.blendingBuffer.shift();
        var drawable = blendedItem.drawable;
        var modelViewMatrix = blendedItem.matrix;

        gl.enable(gl.BLEND);
        gl.depthFunc(gl.LESS);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

        drawable.draw(modelViewMatrix);

        gl.disable(gl.BLEND);
    }
};

SceneGraph.prototype.drawObjects = function(drawList, modelViewMatrix)
{
    for (var i=0; i < drawList.length; i++)
    {
        var currentDrawable = drawList[i];
        this.push(modelViewMatrix);
        this.processChildren(currentDrawable, modelViewMatrix);
        this.processDrawable(currentDrawable, modelViewMatrix);
        modelViewMatrix = this.pop();
    }
};

SceneGraph.prototype.processChildren = function(currentDrawable, modelViewMatrix)
{
    //check if this is a celestial body and needs further drawing operations
    if(currentDrawable instanceof CelestialBody)
    {
        currentDrawable.subSystemTransforms(modelViewMatrix);

        this.push(modelViewMatrix);
        var children = currentDrawable.getChildren();
        this.drawObjects(children, modelViewMatrix);
        modelViewMatrix = this.pop();
    }
};

SceneGraph.prototype.processDrawable = function(currentDrawable, modelViewMatrix)
{
    if(currentDrawable.isBlended)
    {
        this.blendingBuffer.push({
            "drawable": currentDrawable,
            "matrix": modelViewMatrix
        });
    }
    else
    {
        currentDrawable.draw(modelViewMatrix);
    }
};

SceneGraph.prototype.animateScene = function(delta)
{
    this.doAnimate(this.drawableObjects, delta);
};

SceneGraph.prototype.doAnimate = function(drawList, delta)
{
    for (var i=0; i < drawList.length; i++)
    {
        drawList[i].animate(delta);
        if(typeof drawList[i].getChildren === 'function')
        {
            var children = drawList[i].getChildren();
            this.doAnimate(children, delta);
        }
    }
};

SceneGraph.prototype.initBuffers = function()
{
    this.doInitBuffers(this.drawableObjects);
};

SceneGraph.prototype.doInitBuffers = function(drawList)
{
    for (var i=0; i < drawList.length; i++)
    {
        drawList[i].initBuffers();
        if(typeof drawList[i].getChildren === 'function')
        {
            var children = drawList[i].getChildren();
            this.doInitBuffers(children);
        }
    }
};
