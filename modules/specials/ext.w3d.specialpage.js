'use strict';
$( function () {
	let viewer, config;

	if ( mw.config.get( 'w3d-ctm' ) !== null || mw.config.get( 'w3d-collada' ) ) {
		let controls, button;

		controls = document.getElementById( 'controls' );
		controls.classList.remove( 'hidden' );
		button = document.getElementById( 'fullScreen' );
		button.classList.remove( 'hidden' );

		if ( mw.config.get( 'w3d-ctm' ) !== null ) {
			config = mw.config.get( 'w3d-ctm' );
		} else {
			config = mw.config.get( 'w3d-collada' );
		}
		viewer = config.viewers[ 0 ];
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

		document.getElementById( 'rotationX' ).addEventListener( 'input', changeRotation );
		document.getElementById( 'rotationY' ).addEventListener( 'input', changeRotation );
		document.getElementById( 'rotationZ' ).addEventListener( 'input', changeRotation );
		document.getElementById( 'positionX' ).addEventListener( 'input', changePosition );
		document.getElementById( 'positionY' ).addEventListener( 'input', changePosition );
		document.getElementById( 'positionZ' ).addEventListener( 'input', changePosition );
		document.getElementById( 'sceneScene' ).addEventListener( 'change', function ( event ) {
			let select, selected;

			select = event.target;
			selected = select.options[ select.selectedIndex ].value;

			viewer.changeScene( selected );
			addLightList();
		} );
		document.getElementById( 'cameraFOV' ).addEventListener( 'input', function ( event ) {
			viewer.changeCameraFOV( event.target.value );
		} );
		document.getElementById( 'resolutionSelect' ).addEventListener( 'input', function ( event ) {
			let select, selected;

			select = event.target;
			selected = select.options[ select.selectedIndex ].value;

			viewer.changeRenderResolution( selected );
		} );
		document.getElementById( 'sceneDownload' ).addEventListener( 'click', function () {
			viewer.downloadImage();
		} );

		/**
		 * CTM Related Stuff
		 */
		if ( document.getElementById( 'wireframe' ) !== null ) {
			document.getElementById( 'wireframe' ).addEventListener( 'click', function ( event ) {
				let target;

				target = event.target;
				if ( target.className.indexOf( 'red' ) > -1 ) {
					target.classList.remove( 'red' );
					target.classList.add( 'green' );
				} else {
					target.classList.add( 'red' );
					target.classList.remove( 'green' );
				}
				viewer.toggleWireFrame();
			} );
		}

		if ( document.getElementById( 'material' ) !== null ) {
			document.getElementById( 'material' ).addEventListener( 'change', function ( event ) {
				let select, selected;

				select = event.target;
				selected = select.options[ select.selectedIndex ].value;

				viewer.changeMaterial( selected );
			} );
		}

		if ( document.getElementById( 'color' ) !== null ) {
			document.getElementById( 'color' ).addEventListener( 'change', function ( event ) {
				let color;

				color = event.target.value;
				viewer.changeMaterialColor( color );
			} );
		}
	}

	function changeRotation( event ) {
		let update;

		update = {
			target: '',
			value: event.target.value
		};

		switch ( event.target.id ) {
			case 'rotationX':
				update.target = 'x';
				break;

			case 'rotationY':
				update.target = 'y';
				break;

			case 'rotationZ':
				update.target = 'z';
				break;

			default:
				break;
		}
		viewer.updateMainObject( 'rotation', update );
	}

	function changePosition( event ) {
		let update;

		update = {
			target: '',
			value: event.target.value
		};

		switch ( event.target.id ) {
			case 'positionX':
				update.target = 'x';
				break;

			case 'positionY':
				update.target = 'y';
				break;

			case 'positionZ':
				update.target = 'z';
				break;

			default:
				break;
		}
		viewer.updateMainObject( 'position', update );
	}

	function addLightList() {
		let listElement, lightList;

		listElement = document.getElementById( 'lightList' );
		listElement.innerHTML = '';

		lightList = viewer.getLightList();

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
		currentResolution = config.configs[ 0 ].renderer.resolution;

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

		viewer.toggleLight( event.target.id );
	}

} );
