'use strict';
( function () {
	let textureLoader = new THREE.TextureLoader();

	const MATERIALS = [
			{
				name: 'default',
				material: 'standard',
				config: {
					side: THREE.DoubleSide,
					roughness: 0.8,
					metalness: 0.1
				}
			},
			{
				name: 'normal',
				material: 'lambert',
				config: {
					side: THREE.DoubleSide
				}
			},
			{
				name: 'rgb',
				material: 'normal',
				config: {
					side: THREE.DoubleSide
				}
			},
			{
				name: 'shiny',
				material: 'phong',
				config: {
					side: THREE.DoubleSide
				}
			},
			{
				name: 'flat',
				material: 'basic',
				config: {
					side: THREE.DoubleSide
				}
			}
		],
		SCENES = [
			{
				name: 'default',
				lights: [
					{
						type: 'directional',
						name: 'directional_1',
						listName: 'Directional Light 1',
						config: {
							color: 0xffffff,
							intensity: 0.9
						},
						position: { x: 0, y: 1, z: 0 }
					},
					{
						type: 'directional',
						name: 'directional_2',
						listName: 'Directional Light 2',
						config: {
							color: 0xffffff,
							intensity: 0.9
						},
						position: { x: 0, y: -1, z: 0 }
					}
				]
			},
			{
				name: 'space',
				meshes: [
					{
						name: 'background',
						geometry: {
							type: 'sphere',
							config: {
								radius: 10000,
								widthSegments: 25,
								heightSegments: 25
							}
						},
						material: {
							type: 'phong',
							config: {
								map: textureLoader.load( mw.config.get( 'wgExtensionAssetsPath' ) + '/Wiki3D/modules/scenes/b.jpg' ),
								side: THREE.BackSide
							}
						}
					}
				],
				lights: [
					{
						type: 'hemisphere',
						name: 'hemisphere',
						listName: 'Hemisphere Light',
						config: {
							skyColor: 0xffffff,
							groundColor: 0xffffff,
							intensity: 0.5
						}
					},
					{
						type: 'directional',
						name: 'directional_1',
						listName: 'Directional Light 1',
						config: {
							color: 0xffffff
						},
						position: { x: 0, y: 1, z: 0 }
					},
					{
						type: 'directional',
						name: 'directional_2',
						listName: 'Directional Light 2',
						config: {
							color: 0xffffff,
							intensity: 0.4
						},
						position: { x: 1, y: 0, z: 0 }
					}
				]
			},
			{
				name: 'starcitizen',
				meshes: [
					{
						name: 'background',
						geometry: {
							type: 'sphere',
							config: {
								radius: 10000,
								widthSegments: 25,
								heightSegments: 25
							}
						},
						material: {
							type: 'phong',
							config: {
								map: textureLoader.load( mw.config.get( 'wgExtensionAssetsPath' ) + '/Wiki3D/modules/scenes/a.jpg' ),
								side: THREE.BackSide
							}
						}
					}
				],
				lights: [
					{
						type: 'hemisphere',
						name: 'hemisphere',
						listName: 'Hemisphere Light',
						config: {
							skyColor: 0xffffff,
							groundColor: 0xffffff
						}
					},
					{
						type: 'directional',
						name: 'directional_1',
						listName: 'Directional Light 1',
						config: {
							color: 0xffffff
						},
						position: { x: 0, y: 1, z: 0 }
					},
					{
						type: 'directional',
						name: 'directional_2',
						listName: 'Directional Light 2',
						config: {
							color: 0xffffff,
							intensity: 0.4
						},
						position: { x: 1, y: 0, z: 0 }
					}
				]
			}
		],
		RESOLUTIONS = {
			sd: {
				listName: 'SD',
				width: 640,
				height: 360,
				aspect: 16 / 9
			},
			hd: {
				listName: 'HD (720p)',
				width: 1280,
				height: 720,
				aspect: 16 / 9
			},
			fullHD: {
				listName: 'FullHD (1080p)',
				width: 1920,
				height: 1080,
				aspect: 16 / 9
			},
			ultraHD4k: {
				listName: 'UltraHD (4k)',
				width: 3840,
				height: 2160,
				aspect: 16 / 9
			}
		},
		POSITIONS = [ 'x', 'y', 'z' ],
		POSITION_TYPES = [ 'position', 'rotation' ];

	function lightFactory( type, config ) {
		switch ( type ) {
			case 'hemisphere':
				return new THREE.HemisphereLight(
					config.skyColor,
					config.groundColor,
					config.intensity
				);

			case 'directional':
				return new THREE.DirectionalLight(
					config.color,
					config.intensity
				);

			case 'ambient':
				return new THREE.AmbientLight(
					config.color,
					config.intensity
				);

			case 'point':
				return new THREE.PointLight(
					config.color,
					config.intensity,
					config.distance,
					config.decay
				);

			case 'spot':
				return new THREE.SpotLight(
					config.color,
					config.intensity,
					config.distance,
					config.angle,
					config.penumbra,
					config.decay
				);

			default:
				return new THREE.Light(
					config.color,
					config.intensity
				);
		}
	}

	function geometryFactory( type, config ) {
		switch ( type ) {
			case 'box':
				return new THREE.BoxBufferGeometry(
					config.width,
					config.height,
					config.depth,
					config.widthSegments,
					config.heightSegments,
					config.depthSegments
				);

			case 'circle':
				return new THREE.CircleBufferGeometry(
					config.radius,
					config.segments,
					config.thetaStart,
					config.thetaLength
				);

			case 'cone':
				return new THREE.ConeBufferGeometry(
					config.radius,
					config.height,
					config.radiusSegments,
					config.heightSegments,
					config.openEnded,
					config.thetaStart,
					config.thetaLength
				);

			case 'cylinder':
				return new THREE.CylinderBufferGeometry(
					config.radiusTop,
					config.radiusBottom,
					config.height,
					config.radiusSegments,
					config.heightSegments,
					config.openEnded,
					config.thetaStart,
					config.thetaLength
				);

			case 'dodecahedron':
				return new THREE.DodecahedronBufferGeometry(
					config.radius
				);

			case 'icosahedron':
				return new THREE.IcosahedronBufferGeometry(
					config.radius
				);

			case 'octahedron':
				return new THREE.OctahedronBufferGeometry(
					config.radius
				);

			case 'plane':
				return new THREE.PlaneBufferGeometry(
					config.width,
					config.height,
					config.widthSegments,
					config.heightSegments
				);

			case 'ring':
				return new THREE.RingBufferGeometry(
					config.innerRadius,
					config.outerRadius,
					config.thetaSegments,
					config.phiSegments,
					config.thetaStart,
					config.thetaLength
				);

			case 'sphere':
				return new THREE.SphereBufferGeometry(
					config.radius,
					config.widthSegments,
					config.heightSegments,
					config.phiStart,
					config.phiLength,
					config.thetaStart,
					config.thetaLength
				);

			case 'tetrahedron':
				return new THREE.TetrahedronBufferGeometry(
					config.radius
				);

			case 'torus':
				return new THREE.TorusBufferGeometry(
					config.radius,
					config.tube,
					config.radialSegments,
					config.tubularSegments,
					config.arc
				);

			case 'torusknot':
				return new THREE.TorusKnotBufferGeometry(
					config.radius,
					config.tube,
					config.radialSegments,
					config.tubularSegments,
					config.p,
					config.q
				);

			default:
				return new THREE.BufferGeometry();
		}
	}

	function materialFactory( type ) {
		switch ( type ) {
			case 'basic':
				return new THREE.MeshBasicMaterial();

			case 'lambert':
				return new THREE.MeshLambertMaterial();

			case 'normal':
				return new THREE.MeshNormalMaterial();

			case 'phong':
				return new THREE.MeshPhongMaterial();

			case 'standard':
				return new THREE.MeshStandardMaterial();

			default:
				return new THREE.Material();
		}
	}

	function createGroups() {
		let groups;

		groups = {};

		for ( let i = 0; i < SCENES.length; ++i ) {
			let lightList, group;

			lightList = [];
			group = new THREE.Group();

			if ( 'meshes' in SCENES[ i ] ) {
				for ( let j = 0; j < SCENES[ i ].meshes.length; ++j ) {
					let geometry, material, mesh;

					geometry = geometryFactory(
						SCENES[ i ].meshes[ j ].geometry.type,
						SCENES[ i ].meshes[ j ].geometry.config
					);

					material = materialFactory( SCENES[ i ].meshes[ j ].material.type );
					material.setValues( SCENES[ i ].meshes[ j ].material.config );

					mesh = new THREE.Mesh( geometry, material );
					mesh.name = SCENES[ i ].meshes[ j ].name || '';

					group.add( mesh );
				}
			}

			if ( 'lights' in SCENES[ i ] ) {
				for ( let j = 0; j < SCENES[ i ].lights.length; ++j ) {
					let lightData, light;

					lightData = SCENES[ i ].lights[ j ];
					light = lightFactory( lightData.type, lightData.config );
					if ( 'position' in lightData ) {
						light.position.set(
							lightData.position.x,
							lightData.position.y,
							lightData.position.z
						);
					}
					light.name = lightData.name || '';

					lightList.push( {
						uuid: light.uuid,
						name: light.name,
						listName: lightData.listName
					} );

					group.add( light );
				}
			}
			group.userData.lightList = lightList;
			groups[ SCENES[ i ].name ] = group;
		}

		return groups;
	}

	function createMaterials() {
		let materials = {};

		for ( let i = 0; i < MATERIALS.length; ++i ) {
			let material;
			material = materialFactory( MATERIALS[ i ].material );
			material.setValues( MATERIALS[ i ].config );
			materials[ MATERIALS[ i ].name ] = material;
		}

		return materials;
	}

	/**
	 * @class mw.w3d
	 * @singleton
	 */
	mw.w3d = {
		getMaterials: function () {
			return createMaterials();
		},
		getSceneGroups: function () {
			return createGroups();
		},
		getResolutions: function () {
			return RESOLUTIONS;
		},
		getResolution: function ( name ) {
			return RESOLUTIONS[ name ];
		}
	};
}() );
