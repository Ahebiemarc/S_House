import { View, Text, StyleSheet, ImageSourcePropType, Image } from "react-native";
import { images } from "../../application/utils/constants/assets";

const _itemSize = 60;
const _borderRadius = 8;
const _spacing = 4;

type AddBtnListingProps = {
    data: Array<any>;
    
}


const getRandomRotation = () =>{
    return (Math.random() > 0.5 ? -1 : 1) * Math.random() * 15;
}


const Item : React.FC<{item: any, index:number}> = ({item, index}) => {
    return (
        <View style={{
            width : _itemSize,
            height: _itemSize,
            aspectRatio: 1,
            borderRadius: _borderRadius,
            padding: _spacing,
            backgroundColor: "#fff",
            shadowColor: "#000",
            shadowOffset:{
                width: 0,
                height: 0,
            },
            shadowOpacity: 0.4,
            shadowRadius: 7,
            elevation: 5,
            marginLeft: index =! 0 ? -_itemSize/2 : 0,
            transform: [{
                rotate: `${getRandomRotation()}deg`,
            }]
        }} >
            <Image source={item.img} style={{
                flex: 1,
                borderRadius: _borderRadius,
                width : _itemSize,
                height: _itemSize,

            }} />
        </View>
    )
}
const AddBtnListing : React.FC<AddBtnListingProps> = ({data}) => {
    return(
        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: 'center'}} >
            <View style={{flex: 0.6}} >
             <Text style={styles.text}>{data.length} publications</Text>
            </View>
            <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}>
                {data.slice(0, 5).map((item, index) => (
                    <Item key={item.img}  item={item} index={index} />
                ))
            }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    itemContainer:{
        
    },
    text: {
        fontFamily: "Poppins-Regular",
        fontSize: 16,
        color: "#757575"
    }
});

export default AddBtnListing;