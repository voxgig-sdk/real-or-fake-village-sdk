<?php
declare(strict_types=1);

// RealOrFakeVillage SDK utility: prepare_path

class RealOrFakeVillagePreparePath
{
    public static function call(RealOrFakeVillageContext $ctx): string
    {
        $point = $ctx->point;
        $parts = [];
        if ($point) {
            $p = \Voxgig\Struct\Struct::getprop($point, 'parts');
            if (is_array($p)) {
                $parts = $p;
            }
        }
        return \Voxgig\Struct\Struct::join($parts, '/', true);
    }
}
