$( function () {
    var w3dConfig = mw.config.get('w3d');
    var ctmViewer;

    if (w3dConfig !== null) {
        ctmViewer = w3dConfig.ctm.viewers;
        addEventListener();
        for (var i=0; i<ctmViewer.length; i++) {

        }
    }

    function addEventListener() {
        document.getElementById('shipWireframe').addEventListener('click', function() {
            ctmViewer[0].toggleWireFrame();
        });
        document.getElementById('shipRotationX').addEventListener('input', changeRotation);
        document.getElementById('shipRotationY').addEventListener('input', changeRotation);
        document.getElementById('shipRotationZ').addEventListener('input', changeRotation);
        document.getElementById('shipPositionX').addEventListener('input', changePosition);
        document.getElementById('shipPositionY').addEventListener('input', changePosition);
        document.getElementById('shipPositionZ').addEventListener('input', changePosition);

        document.getElementById('lightsHemisphereToggle').addEventListener('click', toggleLight);
        document.getElementById('lightsDirectional1Toggle').addEventListener('click', toggleLight);
        document.getElementById('lightsDirectional2Toggle').addEventListener('click', toggleLight);

        document.getElementById('shipColor').addEventListener('change', function(event) {
            ctmViewer[0].changeShipColor(event);
        });

        document.getElementById('sceneScene').addEventListener('change', function(event) {
            ctmViewer[0].changeScene(event);
        });

        document.getElementById('shipMaterial').addEventListener('change', function(event) {
            ctmViewer[0].changeMaterial(event);
        });

        document.getElementById('cameraFOV').addEventListener('input', function(event) {
            ctmViewer[0].changeCameraFOV(event);
        });

        document.getElementById('resolutionSelect').addEventListener('input', function(event) {
            ctmViewer[0].changeRenderResolution(event);
        });

        document.getElementById('sceneDownload').addEventListener('click', function() {
            ctmViewer[0].downloadImage();
        });

    }

    function changeRotation(event) {
        var update = {
            target: '',
            value: event.target.value
        };

        switch (event.target.id) {
            case 'shipRotationX':
                update.target = 'x';
                break;

            case 'shipRotationY':
                update.target = 'y';
                break;

            case 'shipRotationZ':
                update.target = 'z';
                break;

            default:
                break;
        }
        ctmViewer[0].updateShip('rotation', update);
    }

    function changePosition(event) {
        var update = {
            target: '',
            value: event.target.value
        };

        switch (event.target.id) {
            case 'shipPositionX':
            update.target = 'x';
            break;

            case 'shipPositionY':
                update.target = 'y';
                break;

            case 'shipPositionZ':
                update.target = 'z';
                break;

            default:
                break;
        }
        ctmViewer[0].updateShip('position', update);
    }

    function toggleLight(event) {
        ctmViewer[0].toggleLight(event);
    }
});