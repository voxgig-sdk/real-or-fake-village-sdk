<?php
declare(strict_types=1);

// RealOrFakeVillage SDK utility: result_headers

class RealOrFakeVillageResultHeaders
{
    public static function call(RealOrFakeVillageContext $ctx): ?RealOrFakeVillageResult
    {
        $response = $ctx->response;
        $result = $ctx->result;
        if ($result) {
            if ($response && is_array($response->headers)) {
                $result->headers = $response->headers;
            } else {
                $result->headers = [];
            }
        }
        return $result;
    }
}
