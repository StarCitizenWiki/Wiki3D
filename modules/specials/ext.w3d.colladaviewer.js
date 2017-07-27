'use strict';
$( function () {
	let colladaViewer;

	if ( mw.config.get( 'w3d-collada' ) !== null ) {
		let controls, button;

		controls = document.getElementById( 'controls' );
		controls.classList.remove( 'hidden' );
		button = document.getElementById( 'fullScreen' );
		button.classList.remove( 'hidden' );

		colladaViewer = mw.config.get( 'w3d-collada' ).viewers[ 0 ];
		addEventListener();
		addLightList();
		addSceneList();
		addRenderResolutions();
	}

	function addEventListener() {
		document.getElementById( 'toggleButton' ).addEventListener( 'click', function () {
			let controls, button;

			controls = document.getElementById( 'controls' );
			button = document.getElementById( 'toggleButton' );

			if ( controls.className.indexOf( 'visible' ) > -1 ) {
				controls.classList.remove( 'visible' );
				button.innerHTML = '>';
			} else {
				controls.classList.add( 'visible' );
				button.innerHTML = '&times;';
			}
		} );

		document.getElementById( 'fullScreen' ).addEventListener( 'click', function () {
			let wrapper, button;

			wrapper = document.getElementById( 'w3dWrapper' );
			button = document.getElementById( 'fullScreen' );

			if ( wrapper.className.indexOf( 'fullscreen' ) > -1 ) {
				wrapper.classList.remove( 'fullscreen' );
				button.innerHTML = '&nearrow;';
			} else {
				wrapper.classList.add( 'fullscreen' );
				button.innerHTML = '&swarrow;';
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

	function addSceneList() {
		let listElement, sceneList;

		sceneList = mw.w3d.getScenes();
		listElement = document.getElementById( 'sceneScene' );

		for ( let i = 0; i < sceneList.length; i++ ) {
			let optionElement;

			if ( sceneList[ i ].name !== undefined ) {
				optionElement = document.createElement( 'option' );
				optionElement.value = sceneList[ i ].name;

				optionElement.innerHTML = sceneList[ i ].name;

				listElement.appendChild( optionElement );
			}
		}
	}

	function addRenderResolutions() {
		let renderResolutionList, listElement, currentResolution;

		renderResolutionList = mw.w3d.getResolutions();
		listElement = document.getElementById( 'resolutionSelect' );
		currentResolution = mw.config.get( 'w3d-collada' ).configs[ 0 ].renderer.resolution;

		for ( let name in renderResolutionList ) {
			let optionElement;

			if ( renderResolutionList[ name ].listName !== undefined ) {
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
