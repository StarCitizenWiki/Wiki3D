<?php
/**
 * ShipViewer SpecialPage for Wiki3D extension
 *
 * @file
 * @ingroup Extensions
 */

class SpecialShipViewer extends SpecialPage {
    public function __construct() {
        parent::__construct( 'ShipViewer' );
    }

    /**
     * Show the page to the user
     *
     * @param string $sub The subpage string argument (if any).
     *                    [[Special:HelloWorld/subpage]].
     *
     * @return void|string
     */
    public function execute( $sub ) {
        $out = $this->getOutput();

        $jsConfig = $this->getDefaultConfig();

        $out->addModules([
            'ext.w3d.threejs',
            'ext.w3d.ctm',
            'ext.w3d.viewer',
        ]);

        $out->setPageTitle($this->msg('wiki3d-shipviewer'));

        $file = wfFindFile($sub);
        if ($file === false) {
            $out->addHTML('File not found');
        } else {
            $jsConfig['ctm']['path'] = $file->getFullUrl();
            $jsConfig['scene']['controls']['enable'] = true;
            $jsConfig['scene']['camera']['position']['z'] = 200;
        }

        $out->addJsConfigVars([
            'w3d' => [
                'config' => $jsConfig,
            ],
        ]);

        $form = <<<EOF
<input type="checkbox" id="wireframe"> Toggle Wireframe
<select id="scene">
    <option value="default">Default</option>
    <option value="space">Space</option>
    <option value="starcitizen">Star Citizen</option>
</select>
<select id="material">
    <option value="normal">Default</option>
    <option value="rgb">RGB</option>
    <option value="shiny">Shiny</option>
</select>
Rotation Y:<input type="range" id="roty" min="0" max="6.3" value="0" step="0.005"> 
EOF;


        $out->addElement('div', ['id' => 'shipWrapper'],
            $out->addElement('div', ['id' => 'controls'], $out->addHTML($form))
        );
    }

    protected function getGroupName() {
        return 'other';
    }

    private function getDefaultConfig() {
        return [
            'ctm' => [
                'path' => '',
                'scale' => 1,
                'rotation' => [
                    'x' => 0,
                    'y' => 0,
                    'z' => 0,
                    'speed' => [
                        'x' => 0,
                        'y' => 0,
                        'z' => 0,
                    ],
                ],
            ],
            'materials' => [
                'color' => 0x021c26,
                'current' => 'default',
            ],
            'scene' => [
                'current' => 'default',
                'camera' => [
                    'fov' => 80,
                    'aspect' => 0,
                    'near' => 1,
                    'far' => 10000,
                    'position' => [
                        'x' => 0,
                        'y' => 0,
                        'z' => 0,
                    ],
                ],
                'controls' => [
                    'enable' =>  false,
                ],
            ],
            'renderer' => [
                'clear_color' => 0x000000,
                'opacity' => 0,
            ]
        ];
    }
}


