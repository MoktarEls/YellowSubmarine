#version 300 es
#define WEBGL2

precision highp float;

uniform vec3 sunDirection;
uniform vec3 dayTopColor;
uniform vec3 dayBottomColor;
uniform vec3 sunsetColor;
uniform float horizonPower;

out vec4 glFragColor;

in vec3 vDirection;

void main(void) {
    float viewY = clamp(vDirection.y, -1.0, 1.0);  // Y-axis (upwards direction)

    // Gradients based on height (vertical direction)
    vec3 gradientDay = mix(dayBottomColor, dayTopColor, (viewY + 1.0) / 2.0);
    vec3 gradientNight = mix(sunsetColor, dayTopColor, (viewY + 1.0) / 2.0);

    // Calculate a smooth transition between day and night
    float horizon = abs(viewY);
    vec3 skyColor = mix(gradientNight, gradientDay, smoothstep(0.0, horizonPower, horizon));

    // Combine the base sky color with the sun direction
    float sunFactor = max(dot(normalize(sunDirection), vDirection), 0.0);
    vec3 finalColor = mix(skyColor, sunsetColor, sunFactor);

    glFragColor = vec4(finalColor, 1.0);
}
