precision highp float;

uniform vec3 sunDirection;

void main(void) {
    vec3 up = vec3(0.0, 1.0, 0.0);
    float t = clamp(dot(normalize(vec3(0.0,1.0,0.0)), sunDirection), 0.0, 1.0);
    vec3 skyColor = mix(vec3(0.02,0.02,0.1), vec3(0.5,0.7,1.0), t);

    gl_FragColor = vec4(skyColor, 1.0);
}
