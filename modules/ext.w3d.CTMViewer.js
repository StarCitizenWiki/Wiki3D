( function () {
    var toggleWireFrame,
        updateShip,
        changeShipColor,
        changeScene,
        changeMaterial,
        changeCameraFOV,
        changeRenderResolution,
        downloadImage,
        toggleLight,
        getLightList;

    const POSITIONS = ['x', 'y', 'z'];

    /**
     * @class mw.w3d.CTMViewer
     *
     * @constructor
     */
    function CTMViewer(config) {

        getLightList = function () {
            console.log(sceneObject);
        };

        toggleWireFrame = function () {
            ctmObject.material.wireframe = !ctmObject.material.wireframe;
        };

        updateShip = function (type, update) {
            if (POSITIONS.indexOf(update.target) > -1 && ['position', 'rotation'].indexOf(type) > -1) {
                ctmObject[type][update.target] = update.value;
            }
        };

        changeShipColor = function (event) {
            var color = event.target.value;
            color = color.replace('#', '0x');
            config.materials.color = color;
            updateCTMColor();
        };

        changeScene = function (event) {
            var select = event.target;
            var selectedScene = select.options[select.selectedIndex].value;

            sceneObject.remove(sceneGroups[config.scene.current]);
            sceneObject.add(sceneGroups[selectedScene]);
            config.scene.current = selectedScene;
        };

        changeMaterial = function (event) {
            var select = event.target;
            var selectedMaterial = select.options[select.selectedIndex].value;
            var material = materials[selectedMaterial];
            if (typeof material !== 'undefined') {
                material.wireframe = ctmObject.material.wireframe;
                material.color = ctmObject.material.color;
                ctmObject.material = material;
            } else {
                console.error('Material '+selectedMaterial+' does not exist');
            }
        };

        changeCameraFOV = function (event) {
            cameraObject.fov = event.target.value;
            cameraObject.updateProjectionMatrix();
        };

        changeRenderResolution = function (event) {
            var select = event.target;
            var selected = select.options[select.selectedIndex].value;
            selected = mw.w3d.getResolution(selected);

            renderObject.setPixelRatio(window.devicePixelRatio);
            renderObject.setSize(
                selected.width,
                selected.height
            );
            cameraObject.updateProjectionMatrix();
        };

        downloadImage = function () {
            render();
            window.open(renderObject.domElement.toDataURL("image/png"));
        };

        toggleLight = function (event) {
            switch (event.target.id) {
                case 'lightsHemisphereToggle':
                    sceneObject.getObjectByName('hemisphere').visible = !sceneObject.getObjectByName('hemisphere').visible;
                    break;

                case 'lightsDirectional1Toggle':
                    sceneObject.getObjectByName('directional_1').visible = !sceneObject.getObjectByName('directional_1').visible;
                    break;

                case 'lightsDirectional2Toggle':
                    sceneObject.getObjectByName('directional_2').visible = !sceneObject.getObjectByName('directional_2').visible;
                    break;

                default:
                    break;
            }
        };

        var ctmObject,
            sceneObject,
            renderObject,
            controlsObject,
            cameraObject,
            sceneGroups,
            materials;

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
            addRenderElement();
            animate();
        }

        function assembleScene() {
            sceneObject.add(ctmObject);
            sceneObject.add(sceneGroups[config.scene.current]);
            sceneObject.userData.lightList = sceneGroups[config.scene.current].userData;
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

    CTMViewer.prototype = {
        toggleWireFrame: function () {
            toggleWireFrame();
        },
        updateShip: function (type, update) {
            updateShip(type, update);
        },
        changeShipColor: function (event) {
            changeShipColor(event);
        },
        changeScene: function (event) {
            changeScene(event);
        },
        changeMaterial: function (event) {
            changeMaterial(event);
        },
        changeCameraFOV: function (event) {
            changeCameraFOV(event);
        },
        changeRenderResolution: function (event) {
            changeRenderResolution(event);
        },
        downloadImage: function () {
            downloadImage();
        },
        toggleLight: function (event) {
            toggleLight(event);
        },
        getLightList: function () {
            getLightList();
        }
    };

    mw.w3d.CTMViewer = CTMViewer;
}() );