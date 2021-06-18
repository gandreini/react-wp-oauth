export default interface ISurfSpotPreview {
    id?: number;
    name?: string;
    slug?: string;
    direction?: string;
    bottom?: string;
    swell_direction?: string;
    wind_direction?: string;
    size?: number[];
    tide?: string[];
    forecast_is_good?: number;
    flag?: string;
    country?: string;
    region?: string;
    showBreadcrumbs?: boolean;
    loading?: boolean;
}