##
# @license
# Copyright 2018 Google Inc. All Rights Reserved.
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# =============================================================================

# Node.js TensorFlow Binding config:
{
  'variables' : {
    'angle_lib_dir': '<(module_root_dir)/deps/angle/out/Release'
  },
  'targets' : [
    {
      'target_name': 'nodejs_gl_binding-postbuild',
      'dependencies': ['nodejs_gl_binding'],
          'copies': [{
            'destination': '<(module_root_dir)/build/Release',
            'files': [
              "<!@(node -p \"require('fs').readdirSync('./deps/angle/out/Release').map(f=>'deps/angle/out/Release/'+f).join(' ')\")"
            ]
          }]
    },
    {
    'target_name' : 'nodejs_gl_binding',
    'sources' : [
      'binding/binding.cc',
      'binding/egl_context_wrapper.cc',
      'binding/webgl_extensions.cc',
      'binding/webgl_rendering_context.cc',
      'binding/webgl_sync.cc'
    ],
    'include_dirs' : [
      '..',
      '<(module_root_dir)/deps',
      '<(module_root_dir)/deps/angle/include'
    ],
    'conditions' : [
      [
        'OS=="linux"', {
          'libraries' : [
            '-lGLESv2',
            '-lEGL',
          ],
          'cflags': [ '-std=c++11', '-O0' ],
          'cflags!': [ '-O3'],
          'cflags_cc!': [ '-std=gnu++1y', '-O3' ],
          'library_dirs' : ['<(angle_lib_dir)'],
          'ldflags': [
            '-Wl,-rpath \'-Wl,$$ORIGIN\''
          ],
        }
      ]
      # [
      #   'OS=="mac"', {
      #     'libraries' : [
      #       '-lGLESv2',
      #       '-lEGL',
      #     ],
      #     'cflags': [ '-std=c++11' ],
      #     'library_dirs' : ['<(angle_lib_dir)'],
      #     'ldflags': [
      #       '-Wl,-rpath \'-Wl,$$ORIGIN\''
      #     ],
      #   }
      # ],
      # [
      #   'OS=="win"', {
      #     'defines': ['COMPILER_MSVC'],
      #     'libraries': ['libGLESv2', 'libEGL'],
      #     'library_dirs' : ['<(angle_lib_dir)'],
      #   },
      # ]
    ]
  }]
}
