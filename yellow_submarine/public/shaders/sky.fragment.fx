precision highp float;

uniform vec3 sunDirection;

void main(void) {
    float t = clamp(dot(normalize(vec3(0.0, 1.0, 0.0)), normalize(sunDirection)), 0.0, 1.0);

    vec3 nightColor = vec3(0.02, 0.02, 0.1);
    vec3 dayColor = vec3(0.5, 0.7, 1.0);

    vec3 color = mix(nightColor, dayColor, t);
    gl_FragColor = vec4(color, 1.0);
}
