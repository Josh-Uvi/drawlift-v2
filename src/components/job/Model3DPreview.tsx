import { Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { getJobDownloadUrl } from '@/lib/api';
import { jobStore } from '@/lib/jobStore';
import { buildFloorPlan3DScene } from '@/lib/glbGenerator';
import Button from '@/components/shared/Button';

interface Model3DPreviewProps {
  jobId: string;
}

function DirectGeometryModel({
  geometry,
  config,
  wireframe,
}: {
  geometry: any;
  config: any;
  wireframe: boolean;
}) {
  const scene = useMemo(() => {
    return buildFloorPlan3DScene(geometry, config);
  }, [geometry, config]);

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => {
          if (material instanceof THREE.MeshStandardMaterial || 'wireframe' in material) {
            (material as THREE.MeshStandardMaterial).wireframe = wireframe;
          }
        });
      }
    });
  }, [scene, wireframe]);

  return <primitive object={scene} />;
}

function RemoteGLTFModel({ url, wireframe }: { url: string; wireframe: boolean }) {
  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => {
          if (material instanceof THREE.MeshStandardMaterial || 'wireframe' in material) {
            (material as THREE.MeshStandardMaterial).wireframe = wireframe;
          }
        });
      }
    });
  }, [clonedScene, wireframe]);

  return <primitive object={clonedScene} />;
}

export default function Model3DPreview({ jobId }: Model3DPreviewProps) {
  const [wireframe, setWireframe] = useState(false);
  const modelUrl = getJobDownloadUrl(jobId, 'glb');
  const job = jobStore.getJob(jobId);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-800">3D BIM Model Preview</h3>
          <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
            Interactive GLB
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="px-3 py-1 text-xs"
            onClick={() => setWireframe((value) => !value)}
          >
            {wireframe ? 'Solid shading' : 'Wireframe'}
          </Button>
        </div>
      </div>

      <div className="h-96 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-900 shadow-inner relative">
        <Canvas camera={{ position: [12, 14, 12], fov: 45 }} dpr={[1, 2]}>
          <Suspense fallback={null}>
            <Stage environment="city" intensity={0.6} adjustCamera>
              {job?.geometry ? (
                <DirectGeometryModel
                  geometry={job.geometry}
                  config={job.config}
                  wireframe={wireframe}
                />
              ) : (
                <RemoteGLTFModel url={modelUrl} wireframe={wireframe} />
              )}
            </Stage>
          </Suspense>
          <OrbitControls enablePan enableZoom enableRotate makeDefault />
        </Canvas>
      </div>

      <p className="text-center text-xs text-gray-500">
        Left-click drag to rotate · Scroll wheel to zoom · Right-click drag to pan
      </p>
    </div>
  );
}
