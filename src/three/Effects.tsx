import { forwardRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { BlendFunction, Effect } from 'postprocessing';
import { Uniform, Vector2, Vector3 } from 'three';
import { fx } from './fx';
import { cam } from '../nav';

const frag = /* glsl */ `
uniform float uSat;
uniform float uContrast;
uniform float uTime;
uniform float uGrain;
uniform float uShade;
uniform float uDim;
uniform float uFade;
uniform float uTorch;
uniform vec2 uTorchPos;
uniform vec3 uTorchCol;
uniform float uAspect;

float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec3 c = inputColor.rgb;

  // soft warm torch following the cursor
  vec2 d = (uv - uTorchPos) * vec2(uAspect, 1.0);
  c += uTorchCol * uTorch * 0.06 * smoothstep(0.62, 0.0, length(d));

  // grade (work in gamma space so contrast behaves like the prototype's CSS)
  vec3 g = pow(max(c, 0.0), vec3(1.0 / 2.2));
  float l = dot(g, vec3(0.2126, 0.7152, 0.0722));
  g = mix(vec3(l), g, uSat);
  g = (g - 0.5) * uContrast + 0.5;

  // vignette (ellipse centred a little high, like a lens)
  float v = length((uv - vec2(0.5, 0.54)) * vec2(1.0, 1.0)) / 0.72;
  g *= 1.0 - 0.72 * smoothstep(0.5, 1.0, v);

  // house lights / panel shade
  g *= 1.0 - 0.35 * uDim * smoothstep(0.15, 0.95, length((uv - vec2(0.5, 0.55)) * vec2(1.3, 1.0)));
  g = mix(g, vec3(0.012), uShade);

  // film grain
  float n = hash(floor(uv * resolution / 1.5) + fract(uTime * 7.31) * 113.0) - 0.5;
  g += n * uGrain;

  g *= 1.0 - uFade;
  outputColor = vec4(pow(max(g, 0.0), vec3(2.2)), inputColor.a);
}
`;

class FilmGradeEffect extends Effect {
  constructor() {
    super('FilmGrade', frag, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map<string, Uniform>([
        ['uSat', new Uniform(0)],
        ['uContrast', new Uniform(1.06)],
        ['uTime', new Uniform(0)],
        ['uGrain', new Uniform(0.055)],
        ['uShade', new Uniform(0)],
        ['uDim', new Uniform(0)],
        ['uFade', new Uniform(0)],
        ['uTorch', new Uniform(0)],
        ['uTorchPos', new Uniform(new Vector2(0.5, 0.5))],
        ['uTorchCol', new Uniform(new Vector3(1, 0.84, 0.63))],
        ['uAspect', new Uniform(1.6)],
      ]),
    });
  }
}

const FilmGrade = forwardRef<FilmGradeEffect>(function FilmGrade(_, ref) {
  const effect = useMemo(() => new FilmGradeEffect(), []);
  const size = useThree((s) => s.size);
  useFrame((state) => {
    const u = effect.uniforms;
    u.get('uSat')!.value = fx.sat;
    u.get('uContrast')!.value = 1.06 - 0.06 * fx.sat;
    u.get('uTime')!.value = state.clock.elapsedTime;
    u.get('uShade')!.value = fx.shade;
    u.get('uDim')!.value = fx.dim;
    u.get('uFade')!.value = cam.fade;
    u.get('uTorch')!.value = fx.torch;
    (u.get('uTorchPos')!.value as Vector2).set(fx.torchX, fx.torchY);
    u.get('uAspect')!.value = size.width / Math.max(1, size.height);
  });
  return <primitive ref={ref} object={effect} dispose={null} />;
});

export function Effects({ bloom }: { bloom: boolean }) {
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      {bloom ? <Bloom mipmapBlur luminanceThreshold={0.72} luminanceSmoothing={0.25} intensity={0.75} radius={0.7} /> : <></>}
      <FilmGrade />
    </EffectComposer>
  );
}
