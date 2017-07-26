'use strict';
( function () {
	const POSITIONS = [ 'x', 'y', 'z' ], SHIP_POSITION_TYPES = [ 'position', 'rotation' ];

	/**
	 * @class mw.w3d.ColladaViewer
	 *
	 * @constructor
	 */
	function ColladaViewer( config ) {
		let colladaObject,
			sceneObject,
			renderObject,
			controlsObject,
			cameraObject,
			sceneGroups;

		if ( !Detector.webgl ) {
			Detector.addGetWebGLMessage( { parent: document.getElementById( 'container' + config.key ) } );
		} else if ( typeof config !== 'undefined' ) {
			init();
		}

		function init() {
			sceneGroups = mw.w3d.getSceneGroups();

			createScene();
			createCamera();
			createRenderer();
			createControls();
			loadColladaObject();
		}

		function createScene() {
			sceneObject = new THREE.Scene();
		}

		function createCamera() {
			let camera;

			camera = new THREE.PerspectiveCamera(
				config.camera.fov,
				mw.w3d.getResolution( config.renderer.resolution ).aspect,
				config.camera.near,
				config.camera.far
			);
			camera.position.set(
				config.camera.position.x,
				config.camera.position.y,
				config.camera.position.z
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

			if ( !config.controls.enable ) {
				return;
			}

			controls = new THREE.OrbitControls( cameraObject, renderObject.domElement );
			controls.enableZoom = config.controls.enableZoom;
			controls.enableKeys = config.controls.enableKeys;
			controls.enablePan = config.controls.enablePan;
			controls.enableRotate = config.controls.enableRotate;
			controls.enableDamping = config.controls.enableDamping;
			controls.dampingFactor = config.controls.dampingFactor;
			controls.zoomSpeed = config.controls.zoomSpeed;
			controls.rotateSpeed = config.controls.rotateSpeed;
			controls.panSpeed = config.controls.panSpeed;
			controls.minDistance = config.controls.minDistance;
			controls.maxDistance = config.controls.maxDistance;

			controlsObject = controls;
		}

		function loadColladaObject() {
			let colladaLoader;

			colladaLoader = new THREE.ColladaLoader();
			colladaLoader.options.convertUpAxis = true;
			colladaLoader.options.centerGeometry = true;

			if ( config.collada.path !== '' ) {


				colladaLoader.load( config.collada.path, createColladaMesh);
			}

			function createColladaMesh( geometry ) {
				colladaObject = geometry.scene;

				configureColladaObject();
			}

			function configureColladaObject() {
				colladaObject.position.set( 0, 0, 0 );
				colladaObject.castShadow = true;
				colladaObject.receiveShadow = true;
				colladaObject.matrixAutoUpdate = true;

				colladaObject.scale.set( config.collada.scale, config.collada.scale, config.collada.scale );
				colladaObject.rotation.set(
					config.collada.rotation.x,
					config.collada.rotation.y,
					config.collada.rotation.z
				);

				normalizeColladaSize();
			}

			function normalizeColladaSize() {
				let box, scale;

				box = new THREE.Box3().setFromObject( colladaObject );
				scale = box.getSize().x / config.collada.defaultSize;
				scale = 1 / scale;
				colladaObject.scale.set( scale, scale, scale );

				start();
			}
		}

		function start() {
			assembleScene();
			addRenderElement();
			animate();
		}

		function assembleScene() {
			sceneObject.add( colladaObject );
			sceneObject.add( sceneGroups[ config.scene.current ] );
			sceneObject.userData.lightList = sceneGroups[ config.scene.current ].userData.lightList;
		}

		function addRenderElement() {
			let container;

			container = document.getElementById( config.renderer.parent );
			container.appendChild( renderObject.domElement );
		}

		function animate() {
			let rotationX, rotationY, rotationZ;

			requestAnimationFrame( animate );
			if ( config.controls.enable ) {
				controlsObject.update();
			}

			rotationX = parseFloat( colladaObject.rotation.x ) + parseFloat( config.collada.rotation.speed.x );
			rotationX.toFixed( 2 );

			rotationY = parseFloat( colladaObject.rotation.y ) + parseFloat( config.collada.rotation.speed.y );
			rotationY.toFixed( 2 );

			rotationZ = parseFloat( colladaObject.rotation.z ) + parseFloat( config.collada.rotation.speed.z );
			rotationZ.toFixed( 2 );

			colladaObject.rotation.x = rotationX;
			colladaObject.rotation.y = rotationY;
			colladaObject.rotation.z = rotationZ;

			render();
		}

		function render() {
			renderObject.render( sceneObject, cameraObject );
		}

		/*
		Public Methods
		 */
		this.getLightList = function () {
			return sceneGroups[ config.scene.current ].userData.lightList;
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
				colladaObject[ type ][ update.target ] = update.value;
			}
		};

		this.changeScene = function ( sceneName ) {
			if ( sceneName in sceneGroups ) {
				sceneObject.remove( sceneGroups[ config.scene.current ] );
				sceneObject.add( sceneGroups[ sceneName ] );
				config.scene.current = sceneName;
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

	mw.w3d.ColladaViewer = ColladaViewer;
}() );
