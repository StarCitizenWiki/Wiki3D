'use strict';
( function () {
	const POSITIONS = [ 'x', 'y', 'z' ], SHIP_POSITION_TYPES = [ 'position', 'rotation' ];

	/**
	 * @class mw.w3d.CtmViewer
	 *
	 * @constructor
	 */
	function CtmViewer( config ) {
		let ctmObject,
			sceneObject,
			renderObject,
			controlsObject,
			cameraObject,
			sceneGroups,
			materials;

		if ( !Detector.webgl ) {
			Detector.addGetWebGLMessage( { parent: document.getElementById( 'container' + config.key ) } );
		} else if ( typeof config !== 'undefined' ) {
			init();
		}

		function init() {
			sceneGroups = mw.w3d.getSceneGroups();
			materials = mw.w3d.getMaterials();

			createScene();
			createCamera();
			createRenderer();
			createControls();
			loadCtmObject();
		}

		function createScene() {
			sceneObject = new THREE.Scene();
		}

		function createCamera() {
			let camera;

			camera = new THREE.PerspectiveCamera(
				config.scene.camera.fov,
				mw.w3d.getResolution( config.renderer.resolution ).aspect,
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
			let renderer;

			renderer = new THREE.WebGLRenderer( { alpha: true, antialias: true } );
			renderer.setClearColor( config.renderer.clearColor, config.renderer.opacity );
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize(
				mw.w3d.getResolution( config.renderer.resolution ).width,
				mw.w3d.getResolution( config.renderer.resolution ).height
			);

			renderObject = renderer;
		}

		function createControls() {
			let controls;

			if ( !config.scene.controls.enable ) {
				return;
			}

			controls = new THREE.OrbitControls( cameraObject, renderObject.domElement );
			controls.enableZoom = config.scene.controls.enableZoom;
			controls.enableKeys = config.scene.controls.enableKeys;
			controls.enablePan = config.scene.controls.enablePan;
			controls.enableRotate = config.scene.controls.enableRotate;
			controls.enableDamping = config.scene.controls.enableDamping;
			controls.dampingFactor = config.scene.controls.dampingFactor;
			controls.zoomSpeed = config.scene.controls.zoomSpeed;
			controls.rotateSpeed = config.scene.controls.rotateSpeed;
			controls.panSpeed = config.scene.controls.panSpeed;
			controls.minDistance = config.scene.controls.minDistance;
			controls.maxDistance = config.scene.controls.maxDistance;

			controlsObject = controls;
		}

		function loadCtmObject() {
			let ctmLoader;

			ctmLoader = new THREE.CTMLoader();

			if ( config.ctm.path !== '' ) {
				ctmLoader.load( config.ctm.path, createCtmMesh, {
					useWorker: true,
					worker: new Worker( mw.config.get( 'wgExtensionAssetsPath' ) + '/Wiki3D/modules/threejs/ctm/CTMWorker.js' )
				} );
			}

			function createCtmMesh( geometry ) {
				ctmObject = new THREE.Mesh(
					geometry,
					materials[ config.materials.current ]
				);
				configureCtmObject();
			}

			function configureCtmObject() {
				ctmObject.position.set( 0, 0, 0 );
				ctmObject.castShadow = true;
				ctmObject.receiveShadow = true;
				ctmObject.matrixAutoUpdate = true;

				ctmObject.scale.set( config.ctm.scale, config.ctm.scale, config.ctm.scale );
				ctmObject.rotation.set(
					config.ctm.rotation.x,
					config.ctm.rotation.y,
					config.ctm.rotation.z
				);
				ctmObject.material.color.setHex( config.materials.color );

				normalizeCtmSize();
			}

			function normalizeCtmSize() {
				let box, scale;

				box = new THREE.Box3().setFromObject( ctmObject );
				scale = box.getSize().x / config.ctm.defaultSize;
				scale = 1 / scale;
				ctmObject.scale.set( scale, scale, scale );

				start();
			}
		}

		function updateCtmColor() {
			if ( typeof ctmObject.material.color !== 'undefined' ) {
				ctmObject.material.color.setHex( config.materials.color );
			}
		}

		function start() {
			assembleScene();
			addRenderElement();
			animate();
		}

		function assembleScene() {
			sceneObject.add( ctmObject );
			sceneObject.add( sceneGroups[ config.scene.current ] );
			sceneObject.userData.lightList = sceneGroups[ config.scene.current ].userData.lightList;
		}

		function addRenderElement() {
			let container;

			container = document.getElementById( config.renderer.parent );
			container.appendChild( renderObject.domElement );
		}

		function animate() {
			requestAnimationFrame( animate );
			if ( config.scene.controls.enable ) {
				controlsObject.update();
			}
			ctmObject.rotation.y = ctmObject.rotation.y + 0.01;
			renderObject.render( sceneObject, cameraObject );
		}

		/*
		Public Methods
		 */
		this.getLightList = function () {
			return sceneGroups[ config.scene.current ].userData.lightList;
		};

		this.toggleWireFrame = function () {
			if ( typeof ctmObject.material.wireframe !== 'undefined' ) {
				ctmObject.material.wireframe = !ctmObject.material.wireframe;
			}
		};

		this.toggleLight = function ( lightName ) {
			let light;

			light = sceneObject.getObjectByName( lightName );
			if ( typeof light !== 'undefined' ) {
				light.visible = !light.visible;
			}
		};

		this.updateShip = function ( type, update ) {
			if ( POSITIONS.indexOf( update.target ) > -1 && SHIP_POSITION_TYPES.indexOf( type ) > -1 ) {
				ctmObject[ type ][ update.target ] = update.value;
			}

		};

		this.changeShipColor = function ( hexColor ) {
			config.materials.color = hexColor;
			updateCtmColor();
		};

		this.changeScene = function ( sceneName ) {
			if ( sceneName in sceneGroups ) {
				sceneObject.remove( sceneGroups[ config.scene.current ] );
				sceneObject.add( sceneGroups[ sceneName ] );
				config.scene.current = sceneName;
			}
		};

		this.changeMaterial = function ( materialName ) {
			if ( materialName in materials ) {
				let material;

				material = materials[ materialName ];
				if ( typeof material.wireframe !== 'undefined' && typeof ctmObject.material !== 'undefined' ) {
					material.wireframe = ctmObject.material.wireframe;
				}
				material.color = ctmObject.material.color;
				ctmObject.material = material;
			}
		};

		this.changeCameraFOV = function ( value ) {
			cameraObject.fov = value;
			cameraObject.updateProjectionMatrix();
		};

		this.changeRenderResolution = function ( resolutionName ) {
			if ( typeof mw.w3d.getResolution( resolutionName ) !== 'undefined' ) {
				let resolution;

				resolution = mw.w3d.getResolution( resolutionName );
				renderObject.setPixelRatio( window.devicePixelRatio );
				renderObject.setSize( resolution.width, resolution.height );
			}
		};

		this.downloadImage = function () {
			animate();
			window.open( renderObject.domElement.toDataURL( 'image/png' ) );
		};
	}

	mw.w3d.CtmViewer = CtmViewer;
}() );
