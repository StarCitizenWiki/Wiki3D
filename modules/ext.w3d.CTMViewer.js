( function () {
    const POSITIONS = ['x', 'y', 'z'];
    const SHIP_POSITION_TYPES = ['position', 'rotation'];

    /**
     * @class mw.w3d.CTMViewer
     *
     * @constructor
     */
    function CTMViewer(config) {
        var ctmObject,
            sceneObject,
            renderObject,
            controlsObject,
            cameraObject,
            sceneGroups,
            materials;

        this.getLightList = function () {
            return sceneObject;
        };

        this.toggleWireFrame = function () {
            if (typeof ctmObject.material.wireframe !== 'undefined') {
                ctmObject.material.wireframe = !ctmObject.material.wireframe;
            }
        };

        this.updateShip = function (type, update) {
            if (POSITIONS.indexOf(update.target) > -1 && SHIP_POSITION_TYPES.indexOf(type) > -1) {
                ctmObject[type][update.target] = update.value;
            }

        };

        this.changeShipColor = function (hexColor) {
            config.materials.color = hexColor;
            updateCTMColor();
        };

        this.changeScene = function (sceneName) {
            if (sceneName in sceneGroups) {
                sceneObject.remove(sceneGroups[config.scene.current]);
                sceneObject.add(sceneGroups[sceneName]);
                config.scene.current = sceneName;
            } else {
                console.error('Scene '+sceneName+' does not exist');
            }
        };

        this.changeMaterial = function (materialName) {
            if (materialName in materials) {
                var material = materials[materialName];
                if (typeof material.wireframe !== 'undefined' &&
                    typeof ctmObject.material !== 'undefined' &&
                    typeof ctmObject.material.wirefram !== 'undefined'
                ) {
                    material.wireframe = ctmObject.material.wireframe;
                }
                material.color = ctmObject.material.color;
                ctmObject.material = material;
            } else {
                console.error('Material '+materialName+' does not exist');
            }
        };

        this.changeCameraFOV = function (value) {
            cameraObject.fov = value;
            cameraObject.updateProjectionMatrix();
        };

        this.changeRenderResolution = function (resolutionName) {
            if (typeof mw.w3d.getResolution(resolutionName) !== 'undefined') {
                resolution = mw.w3d.getResolution(resolutionName);
                renderObject.setPixelRatio(window.devicePixelRatio);
                renderObject.setSize(
                    resolution.width,
                    resolution.height
                );
            } else {
                console.error('Resolution '+resolutionName+' does not exist');
            }
        };

        this.downloadImage = function () {
            render();
            window.open(renderObject.domElement.toDataURL("image/png"));
        };

        function init() {
            sceneGroups = mw.w3d.getSceneGroups();
            materials = mw.w3d.getMaterials();

            createScene();
            createCamera();
            createRenderer();
            createControls();
            loadCTMObject();
        }

        function createScene() {
            sceneObject = new THREE.Scene();
        }

        function createCamera() {
            var camera = new THREE.PerspectiveCamera(
                config.scene.camera.fov,
                mw.w3d.getResolution(config.renderer.resolution).aspect,
                config.scene.camera.near,
                config.scene.camera.far
            );
            camera.position.set(
                config.scene.camera.position.x,
                config.scene.camera.position.y,
                config.scene.camera.position.z
            );

            cameraObject = camera;
        }

        function createRenderer() {
            var renderer = new THREE.WebGLRenderer({
                alpha: true,
                antialias: true
            });
            renderer.setClearColor(
                config.renderer.clear_color.color,
                config.renderer.clear_color.opacity
            );

            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(
                mw.w3d.getResolution(config.renderer.resolution).width,
                mw.w3d.getResolution(config.renderer.resolution).height
            );
            renderObject = renderer;
        }

        function createControls() {
            var controls = new THREE.OrbitControls(
                cameraObject,
                renderObject.domElement
            );
            controls.enableZoom = config.scene.controls.enable_zoom;
            controls.enableKeys = config.scene.controls.enable_keys;
            controls.enablePan = config.scene.controls.enable_pan;
            controls.enableRotate = config.scene.controls.enable_rotate;
            controls.enableDamping = config.scene.controls.enable_damping;
            controls.dampingFactor = config.scene.controls.damping_factor;
            controls.zoomSpeed = config.scene.controls.zoom_speed;
            controls.rotateSpeed = config.scene.controls.rotate_speed;
            controls.panSpeed = config.scene.controls.pan_speed;
            controls.minDistance = config.scene.controls.min_distance;
            controls.maxDistance = config.scene.controls.max_distance;

            controlsObject = controls;
        }

        function loadCTMObject() {
            if (config.ctm.path === '') {
                console.error('file not set');
                return;
            }
            var ctmLoader = new THREE.CTMLoader();
            ctmLoader.load(config.ctm.path, createCTMMesh, {
                useWorker: true,
                worker: new Worker(mw.config.get('wgExtensionAssetsPath')+'/Wiki3D/modules/threejs/ctm/CTMWorker.js')
            });

            function createCTMMesh(geometry) {
                ctmObject = new THREE.Mesh(
                    geometry,
                    materials[config.materials.current]
                );
                configureCTMObject();
            }

            function configureCTMObject() {
                ctmObject.position.set(0, 0, 0);
                ctmObject.castShadow = true;
                ctmObject.receiveShadow = true;
                ctmObject.matrixAutoUpdate = true;

                ctmObject.scale.set(config.ctm.scale, config.ctm.scale, config.ctm.scale);
                ctmObject.rotation.set(
                    config.ctm.rotation.x,
                    config.ctm.rotation.y,
                    config.ctm.rotation.z
                );
                updateCTMColor();
                start();
            }
        }

        function updateCTMColor() {
            if (typeof ctmObject.material.color !== 'undefined') {
                ctmObject.material.color.setHex(config.materials.color);
            }
        }

        function start() {
            assembleScene();
            configureCamera()
            addRenderElement();
            animate();
        }

        function assembleScene() {
            sceneObject.add(ctmObject);
            sceneObject.add(sceneGroups[config.scene.current]);
            sceneObject.userData.lightList = sceneGroups[config.scene.current].userData.lightList;
        }

        function configureCamera() {
            var box = new THREE.Box3().setFromObject(ctmObject);
            console.log( box.getSize() );
            cameraObject.position.z = box.getSize().x + config.scene.camera.position.z;
        }

        function addRenderElement() {
            var container = document.getElementById(config.renderer.parent);
            container.appendChild(renderObject.domElement);
        }

        function animate() {
            requestAnimationFrame(animate);
            if (config.scene.controls.enable) {
                controlsObject.update();
            }
            render();
        }

        function render() {
            renderObject.render(sceneObject, cameraObject);
        }

        if (typeof config === 'undefined') {
            console.error('config is missing');
        } else {
            init();
        }
    }

    mw.w3d.CTMViewer = CTMViewer;
}() );
