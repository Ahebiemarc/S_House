import { FlatList, ListRenderItem, StyleSheet, View } from "react-native"
import ApartmentItem from "./ApartmentItem.component"
import { useEffect, useState } from "react"

type Props = {
    listings : Array<any>
}
const ApartmentListItems: React.FC<Props> = ({listings}) =>{

    const [loading, setLoading] = useState(false);
    const [filteredItems, setFilteredItems] = useState<any[]>([]);




    useEffect(() => {
        console.log("Reloading Listings");
        setLoading(true);
        setFilteredItems(listings.filter(item => item.medium_url));
        setTimeout(() => {
            setLoading(false);
          }, 200);
        //setLoading(false);
    }, [listings]);


    const RenderItem : ListRenderItem<any> = ({item}) => {
        //console.log(item);
        //console.log(1);
        
        
        return(
            <ApartmentItem listing={item} />
        )
    }

    return(
            <FlatList 
            renderItem={RenderItem}
            keyExtractor={item => item.id}
            data={loading ? [] : filteredItems}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainerStyle}
            />
    )
    
}

const styles = StyleSheet.create({
    contentContainerStyle: {
        gap: 10,
        padding: 10,
    }
});

export default ApartmentListItems;