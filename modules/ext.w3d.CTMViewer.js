( function () {
    const WIDTH = document.getElementById('shipWrapper').offsetWidth;
    const HEIGHT = document.getElementById('shipWrapper').offsetHeight;
    var config, ctmObject, sceneObject, renderObject, controlsObject, cameraObject;

    CTMViewer.cam = cameraObject;

    /**
     * @class mw.w3d.CTMViewer
     *
     * @constructor
     */
    function CTMViewer() {
        if (mw.config.get('w3d') === null) {
            console.error('config is missing');
            return;
        }
        config = mw.config.get('w3d').config;

        document.getElementById('wireframe').addEventListener('change', toggleWireframe);
        document.getElementById('scene').addEventListener('change', changeScene);
        document.getElementById('roty').addEventListener('input', changeRotationY);
        document.getElementById('material').addEventListener('change', changeMaterial);

        function changeScene(event) {
            var select = event.target;
            var selectedScene = select.options[select.selectedIndex].value;

            sceneObject.remove(mw.w3d.getScene(config.scene.current));
            sceneObject.add(mw.w3d.getScene(selectedScene));
            config.scene.current = selectedScene;
        }

        function toggleWireframe(event) {
            if (event.target.checked) {
                ctmObject.material = mw.w3d.getMaterial('wireframe');
            } else {
                ctmObject.material = mw.w3d.getMaterial('normal');
            }
            CTMViewer.updateCTMColor();
        }

        function changeRotationY(event) {
            ctmObject.rotation.y = event.target.value;
        }

        function changeMaterial(event) {
            var select = event.target;
            var selectedMaterial = select.options[select.selectedIndex].value;
            ctmObject.material = mw.w3d.getMaterial(selectedMaterial);
            CTMViewer.updateCTMColor();
        }

        CTMViewer.init();
    }

    CTMViewer.init = function () {
        if (config.ctm.path === '') {
            console.error('ctmFilePath not set');
            return;
        }

        config.scene.camera.aspect = WIDTH / HEIGHT;

        this.initScene();
        this.loadCTMFile();
    };

    CTMViewer.initScene = function () {
        sceneObject = new THREE.Scene();
        sceneObject.add(mw.w3d.getScene(config.scene.current));
    };

    CTMViewer.loadCTMFile = function () {
        var ctmLoader = new THREE.CTMLoader();
        ctmLoader.load(config.ctm.path, function (geometry) {
            ctmObject = new THREE.Mesh(
                geometry,
                mw.w3d.getMaterial(config.materials.current)
            );
            CTMViewer.start();
        }, {
            useWorker: true,
            worker: new Worker(mw.config.get('wgExtensionAssetsPath')+'/Wiki3D/modules/threejs/ctm/CTMWorker.js')
        });
    };

    CTMViewer.start = function () {
        this.configureCTMObject();
        this.updateCTMColor();
        this.createCamera();
        this.createScene();
        this.createRenderer();

        if (config.scene.controls.enable) {
            this.initControls();
        }

        var container = document.getElementById('shipWrapper');
        container.appendChild(renderObject.domElement);

        this.animate();
    };

    CTMViewer.configureCTMObject = function () {
        var scale = config.ctm.scale;

        ctmObject.position.set(0, 0, 0);
        ctmObject.castShadow = false;
        ctmObject.receiveShadow = false;
        ctmObject.matrixAutoUpdate = true;

        ctmObject.scale.set(scale, scale, scale);
        ctmObject.rotation.set(
            config.ctm.rotation.x,
            config.ctm.rotation.y,
            config.ctm.rotation.z
        );
    };

    CTMViewer.updateCTMColor = function () {
        if (typeof ctmObject.material.color !== 'undefined') {
            ctmObject.material.color.setHex(config.materials.color);
        }
    };

    CTMViewer.createCamera = function () {
        var camera = new THREE.PerspectiveCamera(
            config.scene.camera.fov,
            config.scene.camera.aspect,
            config.scene.camera.near,
            config.scene.camera.far
        );
        camera.position.set(
            config.scene.camera.position.x,
            config.scene.camera.position.y,
            config.scene.camera.position.z
        );

        cameraObject = camera;
    };

    CTMViewer.createScene = function () {
        sceneObject.add(ctmObject);
    };

    CTMViewer.createRenderer = function () {
        var renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        renderer.setClearColor(
            config.renderer.clear_color.color,
            config.renderer.clear_color.opacity
        );

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(WIDTH, HEIGHT);
        renderObject = renderer;
    };

    CTMViewer.initControls = function () {
        var controls = new THREE.OrbitControls(
            cameraObject,
            renderObject.domElement
        );
        controls.enableZoom = true;
        controls.enableKeys = true;
        controls.enablePan = true;
        controls.enableRotate = true;
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.zoomSpeed = 1;
        controls.rotateSpeed = 0.05;
        controls.panSpeed = 2;
        controls.minDistance = 1;
        controls.maxDistance = 5000;

        controlsObject = controls;
    };

    CTMViewer.animate = function () {
        requestAnimationFrame(CTMViewer.animate);
        if (config.scene.controls.enable) {
            controlsObject.update();
        }
        CTMViewer.render();
    };

    CTMViewer.render = function () {
        ctmObject.rotation.x += config.ctm.rotation.speed.x;
        ctmObject.rotation.y += config.ctm.rotation.speed.y;
        ctmObject.rotation.z += config.ctm.rotation.speed.z;
        renderObject.render(sceneObject, cameraObject);
    };

    mw.w3d.CTMViewer = CTMViewer;

    $( function () {
        // This code must not be executed before the document is loaded.
        mw.w3d.CTMViewer();
    });

}() );