precision highp float;

uniform vec4 depthShallowColor;
uniform vec4 depthDeepColor;
uniform float depthMaximumDistance;

uniform sampler2D linearDepthTexture;

varying vec4 vScreenPosition;

void main(void){
    vec2 screenUv = (vScreenPosition.xy / vScreenPosition.w) * 0.5 + 0.5;
    float existingDepthLinear = texture2D(linearDepthTexture, screenUv).r;
    float depthDifference = existingDepthLinear - vScreenPosition.w;
    float waterDepthDifference01 = clamp( depthDifference / depthMaximumDistance , 0.0, 1.0);
    vec4 waterColor = mix(depthShallowColor, depthDeepColor, waterDepthDifference01);
    gl_FragColor = waterColor;
}