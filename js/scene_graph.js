function SceneGraph()
{
    this.matrixStack = [];
    this.drawableObjects = [];
}

SceneGraph.prototype.push = function(matrix)
{
    var copy = mat4.clone(matrix);
    this.matrixStack.push(copy);
}

SceneGraph.prototype.pop = function()
{
    if(this.matrixStack.length == 0)
    {
        throw "SceneGraph: Matrix stack is empty!";
    }
    return this.matrixStack.pop();
}

SceneGraph.prototype.addDrawableObject = function(drawable)
{
    this.drawableObjects.push(drawable);
}

SceneGraph.prototype.drawScene = function(modelViewMatrix)
{
    this.drawObjects(this.drawableObjects, modelViewMatrix);
}

SceneGraph.prototype.drawObjects = function(drawList, modelViewMatrix)
{
    for (var i=0; i < drawList.length; i++)
    {
        drawList[i].drawSubSystem(modelViewMatrix);

        var children = drawList[i].getChildren();
        this.push(modelViewMatrix);
        this.drawObjects(children, modelViewMatrix);
        modelViewMatrix = this.pop();

        drawList[i].drawBody(modelViewMatrix);
    }
}

SceneGraph.prototype.animateScene = function(delta)
{
    this.preorderTraversal(this.drawableObjects, CelestialBody.prototype.animate, [delta]);
}

SceneGraph.prototype.initBuffers = function()
{
    this.preorderTraversal(this.drawableObjects, CelestialBody.prototype.initBuffers);
}

SceneGraph.prototype.preorderTraversal = function(drawList, func, arguments)
{
    for (var i=0; i < drawList.length; i++)
    {
        func.apply(drawList[i], arguments);
        var children = drawList[i].getChildren();
        this.preorderTraversal(children, func, arguments);
    }
}
