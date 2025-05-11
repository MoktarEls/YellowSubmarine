#version 300 es
#define WEBGL2

precision highp float;

uniform vec3 sunDirection;
uniform float timeOfDay;

uniform vec3 dayTop;
uniform vec3 dayBottom;

uniform vec3 sunsetTop;
uniform vec3 sunsetBottom;

uniform vec3 nightStartTop;
uniform vec3 nightStartBottom;

uniform vec3 nightTop;
uniform vec3 nightBottom;

uniform vec3 dawnTop;
uniform vec3 dawnBottom;

in vec3 vDirection;
out vec4 glFragColor;

vec3 getSkyGradient(float t, float timeOfDay){

    vec3 topColor;
    vec3 bottomColor;

    if (timeOfDay < 0.20) {
        float f = smoothstep(0.00, 0.20, timeOfDay);
        topColor = mix(nightTop, dawnTop, f);
        bottomColor = mix(nightBottom, dawnBottom, f);

    } else if (timeOfDay < 0.30) {
        float f = smoothstep(0.20, 0.30, timeOfDay);
        topColor = mix(dawnTop, dayTop, f);
        bottomColor = mix(dawnBottom, dayBottom, f);

    } else if (timeOfDay < 0.70) {
        float f = smoothstep(0.30, 0.70, timeOfDay);
        topColor = dayTop;
        bottomColor = dayBottom;

    } else if (timeOfDay < 0.80) {
        float f = smoothstep(0.70, 0.80, timeOfDay);
        topColor = mix(dayTop, sunsetTop, f);
        bottomColor = mix(dayBottom, sunsetBottom, f);

    } else {
        float f = smoothstep(0.80, 1.00, timeOfDay);
        topColor = mix(sunsetTop, nightTop, f);
        bottomColor = mix(sunsetBottom, nightBottom, f);
    }

    return mix(bottomColor, topColor, 1.0 - t); // Inversé pour cube
}

void main(void) {
    float viewY = clamp(vDirection.y, -1.0, 1.0);
    float t = (viewY + 1.0) / 2.0;

    t = pow(1.0 - t, 0.7);

    vec3 color = getSkyGradient(1.0 - t, timeOfDay);
    glFragColor = vec4(color, 1.0);
}

