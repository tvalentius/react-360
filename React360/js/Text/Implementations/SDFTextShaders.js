/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

export const VERT_SHADER = `
attribute vec2 a_position;
attribute vec2 a_uv;
attribute vec4 a_color;
attribute float a_center;

varying vec2 v_uv;
varying vec4 v_color;
varying float v_center;

uniform mat4 u_transform;

void main() {
  v_uv = a_uv;
  v_color = a_color;
  v_center = a_center;
  gl_Position = projectionMatrix * u_transform * vec4(a_position * vec2(1, -1), 0, 1.0);
}
`;

export const FRAG_SHADER = `
precision mediump float;

varying vec2 v_uv;
varying vec4 v_color;
varying float v_center;

uniform sampler2D u_texture;

void main() {
  float ds = 2.;
  float dd = fwidth(v_uv.x) * 16. * ds;

  float distance = texture2D(u_texture, v_uv).r;
  float colorMin = v_center - dd;
  float colorMax = v_center + dd;

  float value = (clamp(distance, colorMin, colorMax) - colorMin) / max(0.00001, colorMax - colorMin);
  float premultAlphaValue = value * v_color.w;
  gl_FragColor = vec4(premultAlphaValue, premultAlphaValue, premultAlphaValue, value) * v_color;
}
`;
