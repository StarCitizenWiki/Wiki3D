( function () {

    const MATERIALS = {
        normal: new THREE.MeshStandardMaterial({
            side: THREE.DoubleSide,
            roughness: 0.8,
            metalness: 0.1,
            color: 0x021c26
        }),
        wireframe: new THREE.MeshLambertMaterial({
            wireframe: true,
            side: THREE.DoubleSide,
            color: 0x021c26
        }),
        rgb: new THREE.MeshNormalMaterial({
            side: THREE.DoubleSide
        }),
        shiny: new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
            color: 0x021c26
        }),
        flat: new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: 0x021c26
        })
    };

    const SCENES = [
        {
            name: "default",
            lights: [
                {
                    light: new THREE.HemisphereLight(0xffffff, 0xffffff, 3)
                },
                {
                    light: new THREE.DirectionalLight(0xffffff),
                    position: {x: 0, y: 1, z: 0}
                },
                {
                    light: new THREE.DirectionalLight(0xffffff),
                    position: {x: 0, y: -1, z: 0}
                }
            ]
        },
        {
            name: "space",
            meshes: [
                new THREE.Mesh(
                    new THREE.SphereGeometry(2000, 25, 25),
                    new THREE.MeshPhongMaterial({
                        map: new THREE.TextureLoader().load("/b.jpg"),
                        side: THREE.BackSide
                    })
                )
            ],
            lights: [
                {
                    light: new THREE.HemisphereLight(0xffffff, 0xffffff)
                },
                {
                    light: new THREE.DirectionalLight(0xffffff),
                    position: {x: 0, y: 1, z: 0}
                },
                {
                    light: new THREE.DirectionalLight(0xffffff, 0.4),
                    position: {x: 1, y: 0, z: 0}
                }
            ]
        },
        {
            name: "starcitizen",
            meshes: [
                new THREE.Mesh(
                    new THREE.SphereGeometry(2000, 25, 25),
                    new THREE.MeshPhongMaterial({
                        map: new THREE.TextureLoader().load("/a.jpg"),
                        side: THREE.BackSide
                    })
                )
            ],
            lights: [
                {
                    light: new THREE.HemisphereLight(0xffffff, 0xffffff)
                },
                {
                    light: new THREE.DirectionalLight(0xffffff),
                    position: {x: 0, y: 1, z: 0}
                },
                {
                    light: new THREE.DirectionalLight(0xffffff, 0.4),
                    position: {x: 1, y: 0, z: 0}
                }
            ]
        }
    ];

    var groups = {};

    /**
     * @class mw.w3d
     * @singleton
     */
    mw.w3d = {
        initGroups: function () {
            var i, j;

            for (i=0; i<SCENES.length; ++i) {
                var group = new THREE.Group();
                if ('meshes' in SCENES[i]) {
                    for (j=0; j<SCENES[i].meshes.length; ++j) {
                        console.log('add mesh '+SCENES[i].name);
                        group.add(SCENES[i].meshes[j]);
                    }
                }

                if ('lights' in SCENES[i]) {
                    for (j=0; j<SCENES[i].lights.length; ++j) {
                        var lightData = SCENES[i].lights[j];
                        var light = lightData['light'];
                        if ('position' in lightData) {
                            light.position.set(
                                lightData['position'].x,
                                lightData['position'].y,
                                lightData['position'].z
                            )
                        }
                        console.log('add light '+SCENES[i].name);
                        group.add(light);
                    }
                }
                groups[SCENES[i].name] = group;
            }
        },
        getMaterial: function (name) {
            return MATERIALS[name];
        },
        getScene: function (name) {
            return groups[name];
        }
    };

    $( function () {
        // This code must not be executed before the document is loaded.
        mw.w3d.initGroups();
    });
}() );