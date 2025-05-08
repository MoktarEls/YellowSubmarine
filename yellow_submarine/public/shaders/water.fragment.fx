precision highp float;

uniform vec4 depthGradientShallow;
uniform vec4 depthGradientDeep;
uniform float depthMaxDistance;

uniform sampler2D cameraDepthTexture;

varying vec4 vScreenPosition;
varying vec2 vUv;

void main(void) {
    vec2 depthTextureUv = vScreenPosition.xy / vScreenPosition.w;
    depthTextureUv = depthTextureUv * 0.5 + 0.5;
    float depth = texture2D(cameraDepthTexture, depthTextureUv).r;

/*
    float t = clamp(depth / depthMaxDistance, 0.0, 1.0);
    vec4 color = mix(depthGradientShallow, depthGradientDeep, t);
 */

    gl_FragColor = vec4(vec3(depth),1.0);
}