$( function () {
    var ctmViewer;

    if (mw.config.get('w3d') !== null) {
        ctmViewer = mw.config.get('w3d').ctm.viewers[0];
        addEventListener();
        //addLightList();
    }

    function addEventListener() {
        document.getElementById('shipWireframe').addEventListener('click', function() {
            ctmViewer.toggleWireFrame();
        });
        document.getElementById('shipRotationX').addEventListener('input', changeRotation);
        document.getElementById('shipRotationY').addEventListener('input', changeRotation);
        document.getElementById('shipRotationZ').addEventListener('input', changeRotation);
        document.getElementById('shipPositionX').addEventListener('input', changePosition);
        document.getElementById('shipPositionY').addEventListener('input', changePosition);
        document.getElementById('shipPositionZ').addEventListener('input', changePosition);

        document.getElementById('shipColor').addEventListener('change', function(event) {
            var color = event.target.value;
            color = color.replace('#', '0x');
            ctmViewer.changeShipColor(color);
        });

        document.getElementById('sceneScene').addEventListener('change', function(event) {
            var select = event.target;
            var selectedScene = select.options[select.selectedIndex].value;

            ctmViewer.changeScene(selectedScene);
        });

        document.getElementById('shipMaterial').addEventListener('change', function(event) {
            var select = event.target;
            var selectedMaterial = select.options[select.selectedIndex].value;

            ctmViewer.changeMaterial(selectedMaterial);
        });

        document.getElementById('cameraFOV').addEventListener('input', function(event) {
            ctmViewer.changeCameraFOV(event.target.value);
        });

        document.getElementById('resolutionSelect').addEventListener('input', function(event) {
            var select = event.target;
            var selected = select.options[select.selectedIndex].value;

            ctmViewer.changeRenderResolution(selected);
        });

        document.getElementById('sceneDownload').addEventListener('click', function() {
            ctmViewer.downloadImage();
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
        ctmViewer.updateShip('rotation', update);
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
        ctmViewer.updateShip('position', update);
    }

    function toggleLight(event) {
        ctmViewer.toggleLight(event);
    }

});