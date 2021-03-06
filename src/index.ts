/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import * as fs from "fs";
import bindings from "bindings";
import { NodeJsGlBinding } from "./binding";

if (!fs.existsSync("build")) {
    throw new Error(`Unable to find build directory.`);
}

const binding = bindings("nodejs_gl_binding") as NodeJsGlBinding;

interface ContextArguments {
    width?: number;
    height?: number;
    webGLCompability?: boolean;
    majorVersion?: number;
    minorVersion?: number;
}

export function createWebGLRenderingContext(
    args: ContextArguments = {},
): ReturnType<typeof binding["createWebGLRenderingContext"]> {
    const width = args.width || 1;
    const height = args.height || 1;
    const webGLCompability = args.webGLCompability || false;
    const majorVersion = args.majorVersion || 3;
    const minorVersion = args.minorVersion || 0;
    return binding.createWebGLRenderingContext(width, height, majorVersion, minorVersion, webGLCompability);
}
