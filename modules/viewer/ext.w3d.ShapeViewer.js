'use strict';
( function () {
	const POSITIONS = [ 'x', 'y', 'z' ], POSITION_TYPES = [ 'position', 'rotation' ];

	/**
	 * @class mw.w3d.ShapeViewer
	 *
	 * @constructor
	 */
	function ShapeViewer( config ) {
		let mainObject,
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
			loadMainObject();
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

			renderObject.domElement.classList.add( 'has-controls' );
		}

		function loadMainObject() {
			let loader;

			loader = new THREE.TextureLoader();
			loader.crossOrigin = 'anonymous';

			if ( config.mainObject.path !== '' ) {
				loader.load( config.mainObject.path, createMesh );
			}

			function createMesh( texture ) {
				let geometry, material;

				geometry = mw.w3d.geometryFactory(
					config.mainObject.type,
					config.mainObject.config
				);

				material = new THREE.MeshPhongMaterial();
				material.map = texture;

				mainObject = new THREE.Mesh( geometry, material );

				configureMainObject();
			}

			function configureMainObject() {
				mainObject.position.set( 0, 0, 0 );
				mainObject.castShadow = true;
				mainObject.receiveShadow = true;
				mainObject.matrixAutoUpdate = true;

				mainObject.scale.set( config.mainObject.scale, config.mainObject.scale, config.mainObject.scale );
				mainObject.rotation.set(
					config.mainObject.rotation.x,
					config.mainObject.rotation.y,
					config.mainObject.rotation.z
				);

				normalizeMainObjectSize();
			}

			function normalizeMainObjectSize() {
				let box, scale;

				box = new THREE.Box3().setFromObject( mainObject );
				scale = box.getSize().x / config.mainObject.defaultSize;
				scale = 1 / scale;
				mainObject.scale.set( scale, scale, scale );

				start();
			}
		}

		function start() {
			assembleScene();
			addRenderElement();
			animate();
		}

		function assembleScene() {
			sceneObject.add( mainObject );
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

			rotationX = parseFloat( mainObject.rotation.x ) + parseFloat( config.mainObject.rotation.speed.x );
			rotationX.toFixed( 2 );

			rotationY = parseFloat( mainObject.rotation.y ) + parseFloat( config.mainObject.rotation.speed.y );
			rotationY.toFixed( 2 );

			rotationZ = parseFloat( mainObject.rotation.z ) + parseFloat( config.mainObject.rotation.speed.z );
			rotationZ.toFixed( 2 );

			mainObject.rotation.x = rotationX;
			mainObject.rotation.y = rotationY;
			mainObject.rotation.z = rotationZ;

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

		this.updateMainObject = function ( type, update ) {
			if ( POSITIONS.indexOf( update.target ) > -1 && POSITION_TYPES.indexOf( type ) > -1 ) {
				mainObject[ type ][ update.target ] = update.value;
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

	mw.w3d.ShapeViewer = ShapeViewer;
}() );
