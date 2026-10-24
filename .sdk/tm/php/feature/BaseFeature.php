<?php
declare(strict_types=1);

// RealOrFakeVillage SDK base feature

class RealOrFakeVillageBaseFeature
{
    public string $version;
    public string $name;
    public bool $active;

    // Positions this feature when added via the client `extend` option:
    // "__before__" / "__after__" / "__replace__" name an already-added
    // feature (mirrors the ts feature `_options`). Declared so setting it
    // on an extension instance avoids the dynamic-property deprecation.
    public ?array $_options = null;

    public function __construct()
    {
        $this->version = '0.0.1';
        $this->name = 'base';
        $this->active = true;
    }

    public function get_version(): string { return $this->version; }
    public function get_name(): string { return $this->name; }
    public function get_active(): bool { return $this->active; }

    public function init(RealOrFakeVillageContext $ctx, array $options): void {}
    public function PostConstruct(RealOrFakeVillageContext $ctx): void {}
    public function PostConstructEntity(RealOrFakeVillageContext $ctx): void {}
    public function SetData(RealOrFakeVillageContext $ctx): void {}
    public function GetData(RealOrFakeVillageContext $ctx): void {}
    public function GetMatch(RealOrFakeVillageContext $ctx): void {}
    public function SetMatch(RealOrFakeVillageContext $ctx): void {}
    public function PrePoint(RealOrFakeVillageContext $ctx): void {}
    public function PreSpec(RealOrFakeVillageContext $ctx): void {}
    public function PreRequest(RealOrFakeVillageContext $ctx): void {}
    public function PreResponse(RealOrFakeVillageContext $ctx): void {}
    public function PreResult(RealOrFakeVillageContext $ctx): void {}
    public function PreDone(RealOrFakeVillageContext $ctx): void {}
    public function PreUnexpected(RealOrFakeVillageContext $ctx): void {}
}
