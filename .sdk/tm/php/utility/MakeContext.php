<?php
declare(strict_types=1);

// RealOrFakeVillage SDK utility: make_context

require_once __DIR__ . '/../core/Context.php';

class RealOrFakeVillageMakeContext
{
    public static function call(array $ctxmap, ?RealOrFakeVillageContext $basectx): RealOrFakeVillageContext
    {
        return new RealOrFakeVillageContext($ctxmap, $basectx);
    }
}
