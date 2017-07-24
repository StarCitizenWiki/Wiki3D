<?php
/**
 * User: Hannes
 * Date: 24.07.2017
 * Time: 12:16
 */

class Wiki3D
{
    public static function getBaseStructure() {
        return [
            'w3d' => [
                'ctm' => [
                    'configs' => [],
                    'viewers' => [],
                ],
                'collada' => [
                    'configs' => [],
                    'viewsers' => [],
                ],
            ],
        ];
    }

    public static function getDefaultCTMConfig() {
        return [
            'ctm' => [
                'path' => '',
                'scale' => 1,
                'rotation' => [
                    'x' => 0,
                    'y' => M_PI_2,
                    'z' => 0,
                    'speed' => [
                        'x' => 0,
                        'y' => 0,
                        'z' => 0,
                    ],
                ],
            ],
            'materials' => [
                'color' => 0x32c6ff,
                'color_hex_str' => '#32c6ff',
                'current' => 'default',
            ],
            'scene' => [
                'current' => 'default',
                'camera' => [
                    'fov' => 60,
                    'aspect' => 0,
                    'near' => 1,
                    'far' => 100000,
                    'position' => [
                        'x' => 0,
                        'y' => 0,
                        'z' => 0,
                    ],
                ],
                'controls' => [
                    'enable' =>  false,
                    'enable_zoom' => true,
                    'enable_keys' => false,
                    'enable_pan' => true,
                    'enable_rotate' => true,
                    'enable_damping' => true,
                    'damping_factor' => 0.25,
                    'zoom_speed' => 1,
                    'rotate_speed' => 0.05,
                    'pan_speed' => 2,
                    'min_distance' => 1,
                    'max_distance' => 10000,
                ],
            ],
            'renderer' => [
                'parent' => 'w3dWrapper',
                'resolution' => 'hd',
                'clear_color' => 0x000000,
                'opacity' => 0,
            ]
        ];
    }
}