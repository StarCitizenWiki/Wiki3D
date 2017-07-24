$( function () {
    var w3dConfig = mw.config.get('w3d');
    if (w3dConfig !== null) {
        if ('ctm' in w3dConfig) {
            for (let i=0; i<w3dConfig['ctm']['configs'].length; i++) {
                w3dConfig['ctm']['viewers'].push(new mw.w3d.CTMViewer(w3dConfig['ctm']['configs'][i]));
            }
        }
        if ('collada' in w3dConfig) {
            for (let i=0; i<w3dConfig['collada']['configs'].length; i++) {
                w3dConfig['collada']['viewers'].push(new mw.w3d.ColladaViewer(w3dConfig['collada']['configs'][i]));
            }
        }
    }
    mw.config.set('w3d', w3dConfig);
});