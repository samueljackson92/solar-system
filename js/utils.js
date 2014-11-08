function createArrayBuffer(bufferData, itemSize)
{
    var arrayBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, arrayBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferData), gl.STATIC_DRAW);
    arrayBuffer.itemSize = itemSize;
    arrayBuffer.numItems = bufferData.length / itemSize;
    return arrayBuffer;
}

function createElementArrayBuffer(bufferData, itemSize)
{
    var elementBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(bufferData), gl.STATIC_DRAW);
    elementBuffer.itemSize = itemSize;
    elementBuffer.numItems = bufferData.length / itemSize;
    return elementBuffer;
}

function bindBufferToShader(buffer, shaderAttribute)
{
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(shaderAttribute, buffer.itemSize, gl.FLOAT, false, 0, 0);
}

function setMatrixUniforms(shaderProgram, modelViewMatrix)
{
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, perspectiveMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, modelViewMatrix);

    var normalMatrix = mat3.create();
    mat3.normalFromMat4(normalMatrix, modelViewMatrix);
    gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
}

//utility function to get a shader script
//code from: http://learningwebgl.com/blog/?p=28
function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;

    while (k) {
        if (k.nodeType == 3)
        {
            str += k.textContent;
        }

        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function loadJSON(fileName, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', fileName, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            var data = JSON.parse(xobj.responseText);
            callback(data);
        }
    };
    xobj.send(null);
}

//convert degrees to radians
function degToRad(degrees)
{
    return degrees * Math.PI / 180;
}

function setParameters(target, source)
{
    var result = {};
    for (var key in source) {
      if (target[key]) result[key] = source[key];
    }
    return result;
}

function extend(base, sub) {
  // Avoid instantiating the base class just to setup inheritance
  // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
  // for a polyfill
  // Also, do a recursive merge of two prototypes, so we don't overwrite
  // the existing prototype, but still maintain the inheritance chain
  // Thanks to @ccnokes
  var origProto = sub.prototype;
  sub.prototype = Object.create(base.prototype);
  for (var key in origProto)  {
     sub.prototype[key] = origProto[key];
  }
  // Remember the constructor property was set wrong, let's fix it
  sub.prototype.constructor = sub;
  // In ECMAScript5+ (all modern browsers), you can make the constructor property
  // non-enumerable if you define it like this instead
  Object.defineProperty(sub.prototype, 'constructor', {
    enumerable: false,
    value: sub
  });
}
