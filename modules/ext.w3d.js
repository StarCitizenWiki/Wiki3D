( function () {
    var textureLoader = new THREE.TextureLoader();

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
    ];

    const SCENES = [
        {
            name: 'default',
            lights: [
                {
                    type: 'directional',
                    name: 'directional_1',
                    list_name: 'Directional Light 1',
                    config: {
                        color: 0xffffff,
                        intensity: 0.9
                    },
                    position: {x: 0, y: 1, z: 0}
                },
                {
                    type: 'directional',
                    name: 'directional_2',
                    list_name: 'Directional Light 2',
                    config: {
                        color: 0xffffff,
                        intensity: 0.9
                    },
                    position: {x: 0, y: -1, z: 0}
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
                            radius: 2000,
                            widthSegments: 25,
                            heightSegments: 25
                        }
                    },
                    material: {
                        type: 'phong',
                        config: {
                            map: textureLoader.load(mw.config.get('wgExtensionAssetsPath')+'/Wiki3D/modules/scenes/b.jpg'),
                            side: THREE.BackSide
                        }
                    }
                }
            ],
            lights: [
                {
                    type: 'hemisphere',
                    name: 'hemisphere',
                    list_name: 'Hemisphere Light',
                    config: {
                        skyColor: 0xffffff,
                        groundColor: 0xffffff,
                        intensity: 0.5
                    }
                },
                {
                    type: 'directional',
                    name: 'directional_1',
                    list_name: 'Directional Light 1',
                    config: {
                        color: 0xffffff
                    },
                    position: {x: 0, y: 1, z: 0}
                },
                {
                    type: 'directional',
                    name: 'directional_2',
                    list_name: 'Directional Light 2',
                    config: {
                        color: 0xffffff,
                        intensity: 0.4
                    },
                    position: {x: 1, y: 0, z: 0}
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
                            radius: 2000,
                            widthSegments: 25,
                            heightSegments: 25
                        }
                    },
                    material: {
                        type: 'phong',
                        config: {
                            map: textureLoader.load(mw.config.get('wgExtensionAssetsPath')+'/Wiki3D/modules/scenes/a.jpg'),
                            side: THREE.BackSide
                        }
                    }
                }
            ],
            lights: [
                {
                    type: 'hemisphere',
                    name: 'hemisphere',
                    list_name: 'Hemisphere Light',
                    config: {
                        skyColor: 0xffffff,
                        groundColor: 0xffffff
                    }
                },
                {
                    type: 'directional',
                    name: 'directional_1',
                    list_name: 'Directional Light 1',
                    config: {
                        color: 0xffffff
                    },
                    position: {x: 0, y: 1, z: 0}
                },
                {
                    type: 'directional',
                    name: 'directional_2',
                    list_name: 'Directional Light 2',
                    config: {
                        color: 0xffffff,
                        intensity: 0.4
                    },
                    position: {x: 1, y: 0, z: 0}
                }
            ]
        }
    ];

    const RESOLUTIONS = {
        hd: {
            width: 1280,
            height: 720,
            aspect: 16/9
        },
        fullhd: {
            width: 1920,
            height: 1080,
            aspect: 16/9
        },
        ultrahd_4k: {
            width: 3840,
            height: 2160,
            aspect: 16/9
        },
        ultrahd_8k: {
            width: 7680,
            height: 4320,
            aspect: 16/9
        }
    };

    function lightFactory(type, config) {
        switch (type) {
            case 'hemisphere':
                return new THREE.HemisphereLight(
                    config.skyColor,
                    config.groundColor,
                    config.intensity
                );
                break;

            case 'directional':
                return new THREE.DirectionalLight(
                    config.color,
                    config.intensity
                );
                break;

            case 'ambient':
                return new THREE.AmbientLight(
                    config.color,
                    config.intensity
                );
                break;

            case 'point':
                return new THREE.PointLight(
                    config.color,
                    config.intensity,
                    config.distance,
                    config.decay
                );
                break;

            case 'spot':
                return new THREE.SpotLight(
                    config.color,
                    config.intensity,
                    config.distance,
                    config.angle,
                    config.penumbra,
                    config.decay
                );
                break;

            default:
                return new THREE.Light(
                    config.color,
                    config.intensity
                );
                break;
        }
    }

    function geometryFactory(type, config) {
        switch (type) {
            case 'box':
                return new THREE.BoxBufferGeometry(
                    config.width,
                    config.height,
                    config.depth,
                    config.widthSegments,
                    config.heightSegments,
                    config.depthSegments
                );
                break;

            case 'circle':
                return new THREE.CircleBufferGeometry(
                    config.radius,
                    config.segments,
                    config.thetaStart,
                    config.thetaLength
                );
                break;

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
                break;

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
                break;

            case 'dodecahedron':
                return new THREE.DodecahedronBufferGeometry(
                    config.radius
                );
                break;

            case 'icosahedron':
                return new THREE.IcosahedronBufferGeometry(
                    config.radius
                );
                break;

            case 'octahedron':
                return new THREE.OctahedronBufferGeometry(
                    config.radius
                );
                break;

            case 'plane':
                return new THREE.PlaneBufferGeometry(
                    config.width,
                    config.height,
                    config.widthSegments,
                    config.heightSegments
                );
                break;

            case 'ring':
                return new THREE.RingBufferGeometry(
                    config.innerRadius,
                    config.outerRadius,
                    config.thetaSegments,
                    config.phiSegments,
                    config.thetaStart,
                    config.thetaLength
                );
                break;

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
                break;

            case 'tetrahedron':
                return new THREE.TetrahedronBufferGeometry(
                    config.radius
                );
                break;

            case 'torus':
                return new THREE.TorusBufferGeometry(
                    config.radius,
                    config.tube,
                    config.radialSegments,
                    config.tubularSegments,
                    config.arc
                );
                break;

            case 'torusknot':
                return new THREE.TorusKnotBufferGeometry(
                    config.radius,
                    config.tube,
                    config.radialSegments,
                    config.tubularSegments,
                    config.p,
                    config.q
                );
                break;

            default:
                return new THREE.BufferGeometry();
                break;
        }
    }

    function createGroups() {
        var i, j, groups = {};

        for (i=0; i<SCENES.length; ++i) {
            var group = new THREE.Group();
            if ('meshes' in SCENES[i]) {
                for (j=0; j<SCENES[i].meshes.length; ++j) {
                    var geometry = geometryFactory(
                        SCENES[i].meshes[j].geometry.type,
                        SCENES[i].meshes[j].geometry.config
                    );

                    var material = materialFactory(SCENES[i].meshes[j].material.type);
                    material.setValues(SCENES[i].meshes[j].material.config);

                    var mesh = new THREE.Mesh(geometry, material);
                    mesh.name = SCENES[i].meshes[j].name || '';

                    group.add(mesh);
                }
            }

            if ('lights' in SCENES[i]) {
                var lightList = [];
                for (j=0; j<SCENES[i].lights.length; ++j) {
                    var lightData = SCENES[i].lights[j];
                    var light = lightFactory(lightData.type, lightData.config);
                    if ('position' in lightData) {
                        light.position.set(
                            lightData.position.x,
                            lightData.position.y,
                            lightData.position.z
                        )
                    }
                    light.name = lightData.name || '';

                    lightList.push({
                        "uuid": light.uuid,
                        "name": light.name
                    });
                    group.add(light);
                }
            }
            group.userData.lightList = lightList;
            groups[SCENES[i].name] = group;
        }

        return groups;
    }

    function createMaterials() {
        var i, materials = {};

        for (i=0; i<MATERIALS.length; ++i) {
            var material = materialFactory(MATERIALS[i].material);
            material.setValues(MATERIALS[i].config);
            materials[MATERIALS[i].name] = material;
        }

        return materials;
    }

    function materialFactory(type) {
        switch (type) {
            case 'basic':
                return new THREE.MeshBasicMaterial();
                break;

            case 'lambert':
                return new THREE.MeshLambertMaterial();
                break;

            case 'normal':
                return new THREE.MeshNormalMaterial();
                break;

            case 'phong':
                return new THREE.MeshPhongMaterial();
                break;

            case 'standard':
                return new THREE.MeshStandardMaterial();
                break;

            default:
                return new THREE.Material();
                break;
        }
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
        getResolution: function (name) {
            return RESOLUTIONS[name];
        }
    };
}() );