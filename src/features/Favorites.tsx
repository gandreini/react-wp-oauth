import axios from "axios";
import List from "./List";
import SurfSpotPreview from "./SurfSpotPreview";
import ISurfSpotPreview from "../model/iSurfSpotPreview";
import { RootState } from "../state/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import formurlencoded from "form-urlencoded";

const Favorites: React.FC = (props) => {
    const spots: ISurfSpotPreview[] = [];
    const userId = useSelector((state: RootState) => state.login.userId);
    const jwtToken = useSelector((state: RootState) => state.login.accessToken);

    const [spotsList, setSpotsList] = useState<ISurfSpotPreview[]>([]);

    useEffect(() => {
        axios
            .post(
                "http://mondosurf-be.local.com/wp-json/mondo-surf-jwt-auth/v1/user-favorites/5/",
                {},
                {
                    headers: {
                        Authorization: "Bearer " + jwtToken,
                    },
                }
            )
            .then((response) => {
                if (response.status === 200) {
                    setSpotsList(response.data);
                    console.log(response);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        if (userId !== -1) {
        }
    }, [jwtToken]);

    return (
        <>
            {spotsList.length > 0 && (
                <List
                    items={spotsList}
                    renderItem={(item) => (
                        <SurfSpotPreview key={item.id} {...item} />
                    )}
                />
            )}
        </>
    );
};
export default Favorites;
