import { createWebGLRenderingContext } from "..";

const vertexShaderSource = `
    attribute vec4 position;
    varying vec2 texcoord;
    void main()
    {
        gl_Position = vec4(position.xy, 0.0, 1.0);
        texcoord = (position.xy * 0.5) + 0.5;
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    uniform sampler2D tex;
    uniform vec4 subtractor;
    varying vec2 texcoord;
    void main()
    {
        vec4 color = texture2D(tex, texcoord);
        if (abs(color.r - subtractor.r) +
            abs(color.g - subtractor.g) +
            abs(color.b - subtractor.b) +
            abs(color.a - subtractor.a) < 8.0)
        {
            gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
        }
        else
        {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
    }
`;


test("upload old texture", () => {
    const gl = createWebGLRenderingContext() as WebGL2RenderingContext;
    gl.viewport(0, 0, 1, 1);

    // Compile vertex shader.
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    expect(gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)).toBeTruthy();

    // Compile fragment shader.
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    expect(gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)).toBeTruthy();

    // Link shader program.
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    expect(gl.getProgramParameter(program, gl.LINK_STATUS)).toBeTruthy();
    gl.useProgram(program);

    const renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.RGBA8, 1, 1);

    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, renderbuffer);

    const oes_ext = gl.getExtension("OES_texture_half_float");

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    const texData = new Float32Array([0, 1, 2, 3]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, oes_ext.HALF_FLOAT_OES, texData);
    gl.uniform1i(gl.getUniformLocation(program, "tex"), 0);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    const floatData = new Float32Array([7000.0, 100.0, 33.0, -1.0]);
    gl.uniform4fv(gl.getUniformLocation(program, "subtractor"), floatData);

    const vertexPosition = gl.getAttribLocation(program, "position");
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, 1, 1, -1, -1, 1, 1, 1, -1, -1, -1]), gl.STATIC_DRAW);


    gl.enableVertexAttribArray(vertexPosition);
    gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.disableVertexAttribArray(vertexPosition);
    gl.vertexAttribPointer(vertexPosition, 4, gl.FLOAT, false, 0, 0);

    const buffer = new Float32Array(4);
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.FLOAT, buffer);
    expect(buffer).toEqual(new Float32Array([1, 0, 0, 1]));
});
