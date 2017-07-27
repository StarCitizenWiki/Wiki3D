'use strict';
$( function () {
	let colladaViewer;

	if ( mw.config.get( 'w3d-collada' ) !== null ) {
		colladaViewer = mw.config.get( 'w3d-collada' ).viewers[ 0 ];
		addEventListener();
		addLightList();
		addRenderResolutions();
	}

	function addEventListener() {
		document.getElementById( 'toggleButton' ).addEventListener( 'click', function () {
			let controls;

			controls = document.getElementById( 'controls' );
			if ( controls.className.indexOf( 'visible' ) > -1 ) {
				controls.classList.remove( 'visible' );
			} else {
				controls.classList.add( 'visible' );
			}
		} );

		document.getElementById( 'shipRotationX' ).addEventListener( 'input', changeRotation );
		document.getElementById( 'shipRotationY' ).addEventListener( 'input', changeRotation );
		document.getElementById( 'shipRotationZ' ).addEventListener( 'input', changeRotation );
		document.getElementById( 'shipPositionX' ).addEventListener( 'input', changePosition );
		document.getElementById( 'shipPositionY' ).addEventListener( 'input', changePosition );
		document.getElementById( 'shipPositionZ' ).addEventListener( 'input', changePosition );


		document.getElementById( 'sceneScene' ).addEventListener( 'change', function ( event ) {
			let select, selected;

			select = event.target;
			selected = select.options[ select.selectedIndex ].value;

			colladaViewer.changeScene( selected );
			addLightList();
		} );

		document.getElementById( 'cameraFOV' ).addEventListener( 'input', function ( event ) {
			colladaViewer.changeCameraFOV( event.target.value );
		} );

		document.getElementById( 'resolutionSelect' ).addEventListener( 'input', function ( event ) {
			let select, selected;

			select = event.target;
			selected = select.options[ select.selectedIndex ].value;

			colladaViewer.changeRenderResolution( selected );
		} );

		document.getElementById( 'sceneDownload' ).addEventListener( 'click', function () {
			colladaViewer.downloadImage();
		} );

	}

	function changeRotation( event ) {
		let update = {
			target: '',
			value: event.target.value
		};

		switch ( event.target.id ) {
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
		colladaViewer.updateMainObject( 'rotation', update );
	}

	function changePosition( event ) {
		let update = {
			target: '',
			value: event.target.value
		};

		switch ( event.target.id ) {
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
		colladaViewer.updateMainObject( 'position', update );
	}

	function addLightList() {
		let listElement, lightList;

		listElement = document.getElementById( 'lightList' );
		listElement.innerHTML = '';

		lightList = colladaViewer.getLightList();

		for ( let i = 0; i < lightList.length; i++ ) {
			let html;

			html = '<div class="form-group"><label for="' + lightList[ i ].name + '">' + lightList[ i ].listName + '</label><button id="' + lightList[ i ].name + '" class="red">Toggle</button></div>';

			listElement.insertAdjacentHTML( 'afterBegin', html );

			document.getElementById( lightList[ i ].name ).addEventListener( 'click', toggleLight );
		}

	}

	function addRenderResolutions() {
		let renderResolutionList, listElement, currentResolution;

		renderResolutionList = mw.w3d.getResolutions();
		listElement = document.getElementById( 'resolutionSelect' );
		currentResolution = mw.config.get( 'w3d' ).collada.configs[ 0 ].renderer.resolution;

		for ( let name in renderResolutionList ) {
			let optionElement;

			if ( !renderResolutionList[ name ].listName ) {
				optionElement = document.createElement( 'option' );
				optionElement.value = name;
				if ( currentResolution === name ) {
					optionElement.setAttribute( 'selected', 'selected' );
				}
				optionElement.innerHTML = renderResolutionList[ name ].listName;

				listElement.appendChild( optionElement );
			}
		}
	}

	function toggleLight( event ) {
		let target;

		target = event.target;
		if ( target.className.indexOf( 'red' ) > -1 ) {
			target.classList.remove( 'red' );
			target.classList.add( 'green' );
		} else {
			target.classList.add( 'red' );
			target.classList.remove( 'green' );
		}

		colladaViewer.toggleLight( event.target.id );
	}

} );
