#version 300 es
#define WEBGL2

precision highp float;

uniform float timeOfDay;

uniform vec3 dayTop;
uniform vec3 dayBottom;

uniform vec3 sunsetTop;
uniform vec3 sunsetBottom;

uniform vec3 nightTop;
uniform vec3 nightBottom;

uniform vec3 dawnTop;
uniform vec3 dawnBottom;

in vec3 vDirection;
out vec4 glFragColor;

vec3 getSkyGradient(float t, float timeOfDay){

    vec3 topColor;
    vec3 bottomColor;

    if (timeOfDay < 0.25) {
        float f = smoothstep(0.00, 0.25, timeOfDay);
        topColor = mix(nightTop, dawnTop, f);
        bottomColor = mix(nightBottom, dawnBottom, f);

    } else if (timeOfDay < 0.50) {
        float f = smoothstep(0.25, 0.50, timeOfDay);
        topColor = mix(dawnTop, dayTop, f);
        bottomColor = mix(dawnBottom, dayBottom, f);

    } else if (timeOfDay < 0.75) {
        float f = smoothstep(0.50, 0.75, timeOfDay);
        topColor = mix(dayTop, sunsetTop, f);
        bottomColor = mix(dayBottom, sunsetBottom, f);

    } else {
        float f = smoothstep(0.75, 1.00, timeOfDay);
        topColor = mix(sunsetTop, nightTop, f);
        bottomColor = mix(sunsetBottom, nightBottom, f);
    }

    return mix(bottomColor, topColor, t);
}

void main(void) {
    float viewY = clamp(vDirection.y, -1.0, 1.0);
    float t = (viewY + 1.0) / 2.0;

    t = pow(1.0 - t, 0.4);

    vec3 color = getSkyGradient(1.0 - t, timeOfDay);
    glFragColor = vec4(color, 1.0);
}
