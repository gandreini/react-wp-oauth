import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// import { returnSwellSizeRange, returnTideDetails } from '../features/surfSpot/surfSpotUtils';
import ISurfSpotPreview from "../model/iSurfSpotPreview";
// import { returnBottomLabel } from '../utils/labels';

// Component.
const SurfSpotPreview: React.FC<ISurfSpotPreview> = (
    props: ISurfSpotPreview
) => {
    const { t } = useTranslation("mondosurf");

    function rootClassName(): string {
        let returnClassName = "ms-surf-spot-preview";
        if (props.forecast_is_good && props.forecast_is_good > -1)
            returnClassName += " is-good ";
        if (props.loading) returnClassName += " is-loading ";
        return returnClassName;
    }

    return (
        <div className={rootClassName()} key={props.id}>
            <Link
                itemProp="url"
                className="ms-surf-spot-preview__link"
                to={"/surf-spot/forecast/" + props.id + "/" + props.slug}
            >
                {props.showBreadcrumbs && (
                    <div className="ms-surf-spot-preview__breadcrumbs">
                        <div className="ms-surf-spot-preview__breadcrumbs-flag">
                            {props.flag}
                        </div>
                        <div className="ms-surf-spot-preview__breadcrumbs-country">
                            {props.country}
                        </div>
                        <div className="ms-surf-spot-preview__breadcrumbs-region">
                            {props.region}
                        </div>
                    </div>
                )}

                <div className="ms-surf-spot-preview__header">
                    <div className="ms-surf-spot-preview__icon">
                        {props.direction && props.direction === "A" && (
                            <span className="mondo-icon-wave-a-frame"></span>
                        )}
                        {props.direction && props.direction === "R" && (
                            <span className="mondo-icon-wave-right"></span>
                        )}
                        {props.direction && props.direction === "L" && (
                            <span className="mondo-icon-wave-left"></span>
                        )}
                        {!props.direction && (
                            <span className="mondo-icon-wave"></span>
                        )}
                    </div>
                    <h2 className="ms-surf-spot-preview__title">
                        {props.name}
                    </h2>
                </div>

                <div className="ms-surf-spot-preview__content">
                    <div className="ms-surf-spot-preview__single-data ms-surf-spot-preview__swell">
                        <div className="ms-surf-spot-preview__label">
                            {t("basics.best_swell")}
                        </div>
                        <div className="ms-surf-spot-preview__value">
                            {props.swell_direction}
                        </div>
                    </div>
                    <div className="ms-surf-spot-preview__single-data ms-surf-spot-preview__wind">
                        <div className="ms-surf-spot-preview__label">
                            {t("basics.best_wind")}
                        </div>
                        <div className="ms-surf-spot-preview__value">
                            {props.wind_direction}
                        </div>
                    </div>
                    <div className="ms-surf-spot-preview__data-row ms-grid-2-2 ms-grid-v-2">
                        {props.bottom && (
                            <div className="ms-surf-spot-preview__single-data">
                                <div className="ms-surf-spot-preview__label">
                                    {t("basics.bottom")}
                                </div>
                                <div className="ms-surf-spot-preview__value">
                                    {props.bottom}
                                </div>
                            </div>
                        )}
                        {props.tide && props.tide.length > 0 && (
                            <div className="ms-surf-spot-preview__single-data">
                                <div className="ms-surf-spot-preview__label">
                                    {t("tide.tide")}
                                </div>
                                <div className="ms-surf-spot-preview__value">
                                    {props.tide}
                                </div>
                            </div>
                        )}
                    </div>
                    {props.size &&
                        (props.size[0] !== 0 || props.size[1] !== 0) && (
                            <div className="ms-surf-spot-preview__row">
                                <div className="ms-surf-spot-preview__single-data">
                                    <div className="ms-surf-spot-preview__spot-size">
                                        {props.size}
                                    </div>
                                </div>
                            </div>
                        )}
                </div>
            </Link>
        </div>
    );
};
export default SurfSpotPreview;
