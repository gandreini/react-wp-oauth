import List from "./List";
import SurfSpotPreview from "./SurfSpotPreview";
import ISurfSpotPreview from "../model/iSurfSpotPreview";

const Favorites: React.FC = (props) => {
    const spots: ISurfSpotPreview[] = [];

    return (
        <>
            <List
                items={spots}
                renderItem={(item) => (
                    <SurfSpotPreview key={item.id} {...item} />
                )}
            />
        </>
    );
};
export default Favorites;
