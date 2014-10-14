function SceneGraph()
{
    this.modelViewMatrix = mat4.create();
    this.perspectiveMatrix = mat4.create();
    this.matrixStack = [];
}

SceneGraph.prototype.push = function()
{
    var copy = mat4.clone(this.modelViewMatrix);
    this.matrixStack.push(copy);
}

SceneGraph.prototype.pop = function()
{
    if(this.matrixStack.length == 0)
    {
        throw "SceneGraph: Matrix stack is empty!";
    }
    this.modelViewMatrix = this.matrixStack.pop();
}
