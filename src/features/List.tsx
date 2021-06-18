import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// <T> generic allows to send the type of item that will be displayed in the list.
interface IList<T> {
    // Array of items of generic type T: the type is sent via the generic.
    items: T[];
    maxItems?: number;
    wrapperClasses?: string;
    // A function is passed that will render each item in the 'items' array.
    // Rendered items are of type: React.ReactNode
    // 'key' is used for items that don't have a unique ID.
    renderItem: (item: T, key: number) => React.ReactNode;
}

// Component.
// It si not possible to pass <T>, it will generate some JSX errors.
// Alternatives are <T extends unknown> or <T extends {}>.
const List = <T,>(props: IList<T>) => {
    const { t } = useTranslation('mondosurf');
    const totalItems = props.items.length;
    const [displayedItems, setDisplayedItems] = useState<number>(props.maxItems ? props.maxItems : -1);

    function showMore(): void {
        if (props.maxItems && displayedItems !== -1) {
            setDisplayedItems((prevValue: number) => {
                return prevValue + props.maxItems!;
            });
        }
    }

    // Looping the array, and render each item using the props function.
    return (
        <>
            {displayedItems === -1 && props.items.map((item, key) => props.renderItem(item, key))}
            {displayedItems !== -1 &&
                !props.wrapperClasses &&
                props.items.slice(0, displayedItems).map((item, key) => props.renderItem(item, key))}
            {displayedItems !== -1 && props.wrapperClasses && (
                <div className={props.wrapperClasses}>
                    {props.items.slice(0, displayedItems).map((item, key) => props.renderItem(item, key))}
                </div>
            )}
            {props.maxItems && totalItems > displayedItems && (
                <button className="ms-list__load-more-btn ms-btn" onClick={showMore}>
                    {t('basics.load_more')}
                </button>
            )}
        </>
    );
};
export default List;

/* Usage example:

<List items={props.spots} renderItem={(item) => <SurfSpotPreview key={item.id} {...item} />} />
<List items={props.spots as IType[]} renderItem={(item) => <SurfSpotPreview key={item.id} {...item} />} />
<List items={props.spots} renderItem={(item, key) => <SurfSpotPreview key={key} {...item} />} />

*/
