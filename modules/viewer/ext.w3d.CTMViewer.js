'use strict';
( function () {
	const POSITIONS = [ 'x', 'y', 'z' ], POSITION_TYPES = [ 'position', 'rotation' ];

	/**
	 * @class mw.w3d.CtmViewer
	 *
	 * @constructor
	 */
	function CtmViewer( config ) {
		let mainObject,
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

		this.getScenes = function () {
			return sceneGroups();
		};

		function init() {
			sceneGroups = mw.w3d.getSceneGroups();
			sceneGroups[ 'default' ].getObjectByName( 'hemisphere' ).intensity = 0.2;
			materials = mw.w3d.getMaterials();

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
			let renderer, container, progress;

			renderer = new THREE.WebGLRenderer( { alpha: true, antialias: true, preserveDrawingBuffer: true } );
			renderer.setClearColor( config.renderer.clearColor, config.renderer.opacity );
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize(
				mw.w3d.getResolution( config.renderer.resolution ).width,
				mw.w3d.getResolution( config.renderer.resolution ).height
			);

			renderObject = renderer;

			container = document.getElementById( config.renderer.parent );
			progress = document.createElement( 'progress' );
			progress.max = 100;
			progress.value = 0;
			progress.id = Math.random().toString( 36 ).replace( /[^a-z]+/g, '' ).substr( 0, 5 );
			renderObject.progressElement = progress;
			container.appendChild( renderer.progressElement );
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

			loader = new THREE.CTMLoader();

			if ( config.mainObject.path !== '' ) {
				loader.load( config.mainObject.path, createMesh, {
					useWorker: true,
					worker: new Worker( mw.config.get( 'wgExtensionAssetsPath' ) + '/Wiki3D/modules/threejs/ctm/CTMWorker.js' )
				}, updateProgress );
			}

			function updateProgress( progress ) {
				let value;

				value = ( progress.loaded * 100 ) / progress.total;

				renderObject.progressElement.value = value.toFixed( 3 );
			}

			function createMesh( geometry ) {
				mainObject = new THREE.Mesh(
					geometry,
					materials[ config.material.current ]
				);
				configureMainObject();
			}

			function configureMainObject() {
				mainObject.position.set( 0, 0, 0 );
				mainObject.castShadow = true;
				mainObject.receiveShadow = true;

				mainObject.scale.set( config.mainObject.scale, config.mainObject.scale, config.mainObject.scale );
				mainObject.rotation.set(
					config.mainObject.rotation.x,
					config.mainObject.rotation.y,
					config.mainObject.rotation.z
				);
				mainObject.material.color.set( config.material.color );

				normalizeMainObjectSize();
			}

			function normalizeMainObjectSize() {
				let box, scale, scaleX, scaleY, scaleZ;

				box = new THREE.Box3().setFromObject( mainObject );
				scale = box.getSize().x / config.mainObject.defaultSize;
				scaleX = 1 / scale;

				scale = box.getSize().y / config.mainObject.defaultSize;
				scaleY = 1 / scale;

				scale = box.getSize().z / config.mainObject.defaultSize;
				scaleZ = 1 / scale;

				scale = Math.min( scaleX, scaleY, scaleZ );

				mainObject.scale.set( scale, scale, scale );

				start();
			}
		}

		function updateMaterialColor() {
			if ( typeof mainObject.material.color !== 'undefined' ) {
				mainObject.material.color.set( config.material.color );
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
			let container, progress;

			container = document.getElementById( config.renderer.parent );

			container.appendChild( renderObject.domElement );

			progress = document.getElementById( renderObject.progressElement.id );
			progress.outerHTML = '';
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

		this.toggleWireFrame = function () {
			if ( typeof mainObject.material.wireframe !== 'undefined' ) {
				mainObject.material.wireframe = !mainObject.material.wireframe;
			}
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

		this.changeMaterialColor = function ( hexColor ) {
			config.material.color = hexColor;
			updateMaterialColor();
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
				if ( typeof material.wireframe !== 'undefined' && typeof mainObject.material !== 'undefined' ) {
					material.wireframe = mainObject.material.wireframe;
				}
				material.color = mainObject.material.color;
				mainObject.material = material;
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

		this.changeRenderBackgroundColor = function ( color ) {
			renderObject.setClearColor( color, 1 );
		};

		this.downloadImage = function () {
			let imgData, link;

			imgData = renderObject.domElement.toDataURL();

			link = document.createElement( 'a' );
			link.download = 'SCW_ship_viewer_download.png';
			link.href = imgData;
			link.click();
		};

		this.changeLightColor = function ( lightName, color ) {
			let light;

			light = sceneObject.getObjectByName( lightName );
			if ( typeof light !== 'undefined' ) {
				light.color.set( color );
			}
		};
	}

	mw.w3d.CtmViewer = CtmViewer;
}() );
