'use strict';
( function () {
	const POSITIONS = [ 'x', 'y', 'z' ], SHIP_POSITION_TYPES = [ 'position', 'rotation' ];

	/**
	 * @class mw.w3d.CTMViewer
	 *
	 * @constructor
	 */
	function CTMViewer( config ) {
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
			loadCTMObject();
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
			renderer.setClearColor( config.renderer.clear_color.color, config.renderer.clear_color.opacity );
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize(
				mw.w3d.getResolution( config.renderer.resolution ).width,
				mw.w3d.getResolution( config.renderer.resolution ).height
			);

			renderObject = renderer;
		}

		function createControls() {
			let controls;

			controls = new THREE.OrbitControls( cameraObject, renderObject.domElement );
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
			let ctmLoader;

			ctmLoader = new THREE.CTMLoader();

			if ( config.ctm.path !== '' ) {
				ctmLoader.load( config.ctm.path, createCTMMesh, {
					useWorker: true,
					worker: new Worker( mw.config.get( 'wgExtensionAssetsPath' ) + '/Wiki3D/modules/threejs/ctm/CTMWorker.js' )
				} );
			}

			function createCTMMesh( geometry ) {
				ctmObject = new THREE.Mesh(
					geometry,
					materials[ config.materials.current ]
				);
				configureCTMObject();
			}

			function configureCTMObject() {
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
				start();
			}
		}

		function updateCTMColor() {
			if ( typeof ctmObject.material.color !== 'undefined' ) {
				ctmObject.material.color.setHex( config.materials.color );
			}
		}

		function start() {
			assembleScene();
			configureCamera();
			addRenderElement();
			animate();
		}

		function assembleScene() {
			sceneObject.add( ctmObject );
			sceneObject.add( sceneGroups[ config.scene.current ] );
			sceneObject.userData.lightList = sceneGroups[ config.scene.current ].userData.lightList;
		}

		function configureCamera() {
			let box;

			box = new THREE.Box3().setFromObject( ctmObject );
			cameraObject.position.z = box.getSize().x + config.scene.camera.position.z;
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
			renderObject.render( sceneObject, cameraObject );
		}

		/*
		Public Methods
		 */
		this.getLightList = function () {
			return sceneGroups[ config.scene.current ];
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
			updateCTMColor();
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

	mw.w3d.CTMViewer = CTMViewer;
}() );
