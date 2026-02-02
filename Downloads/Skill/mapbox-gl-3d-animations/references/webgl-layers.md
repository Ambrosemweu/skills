# Custom WebGL Layers

Integrate Three.js for advanced 3D rendering.

## Basic Custom Layer Structure

```javascript
const customLayer = {
    id: 'custom-threejs-layer',
    type: 'custom',
    renderingMode: '3d',
    
    onAdd: function(map, gl) {
        this.camera = new THREE.Camera();
        this.scene = new THREE.Scene();
        
        // Add lights
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, -70, 100).normalize();
        this.scene.add(directionalLight);
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);
        
        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: map.getCanvas(),
            context: gl,
            antialias: true
        });
        this.renderer.autoClear = false;
        
        this.map = map;
    },
    
    render: function(gl, matrix) {
        // Sync camera with Mapbox
        const m = new THREE.Matrix4().fromArray(matrix);
        this.camera.projectionMatrix = m;
        
        this.renderer.resetState();
        this.renderer.render(this.scene, this.camera);
        this.map.triggerRepaint();
    }
};

map.on('load', () => {
    map.addLayer(customLayer);
});
```

## Adding a 3D Model (GLTF)

```javascript
const modelOrigin = [-122.4194, 37.7749];
const modelAltitude = 0;

// Transform to Mercator coordinates
const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
    modelOrigin,
    modelAltitude
);

const modelTransform = {
    translateX: modelAsMercatorCoordinate.x,
    translateY: modelAsMercatorCoordinate.y,
    translateZ: modelAsMercatorCoordinate.z,
    rotateX: Math.PI / 2,
    rotateY: 0,
    rotateZ: 0,
    scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
};

const customLayer = {
    id: '3d-model',
    type: 'custom',
    renderingMode: '3d',
    
    onAdd: function(map, gl) {
        this.camera = new THREE.Camera();
        this.scene = new THREE.Scene();
        
        // Lighting
        const directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(0, -70, 100);
        this.scene.add(directionalLight);
        
        // Load model
        const loader = new THREE.GLTFLoader();
        loader.load('path/to/model.gltf', (gltf) => {
            this.scene.add(gltf.scene);
        });
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: map.getCanvas(),
            context: gl,
            antialias: true
        });
        this.renderer.autoClear = false;
        
        this.map = map;
    },
    
    render: function(gl, matrix) {
        // Apply model transform
        const rotationX = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(1, 0, 0), modelTransform.rotateX
        );
        const rotationY = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(0, 1, 0), modelTransform.rotateY
        );
        const rotationZ = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(0, 0, 1), modelTransform.rotateZ
        );
        
        const m = new THREE.Matrix4().fromArray(matrix);
        const l = new THREE.Matrix4()
            .makeTranslation(
                modelTransform.translateX,
                modelTransform.translateY,
                modelTransform.translateZ
            )
            .scale(new THREE.Vector3(
                modelTransform.scale,
                -modelTransform.scale,
                modelTransform.scale
            ))
            .multiply(rotationX)
            .multiply(rotationY)
            .multiply(rotationZ);
        
        this.camera.projectionMatrix = m.multiply(l);
        
        this.renderer.resetState();
        this.renderer.render(this.scene, this.camera);
        this.map.triggerRepaint();
    }
};
```
