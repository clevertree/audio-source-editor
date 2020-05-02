import { StyleSheet } from 'react-native';

export default StyleSheet.create({

    default: {
        backgroundColor: '#DDD',
        borderWidth: 1,
        borderLeftColor: '#FFF',
        borderTopColor: '#FFF',
        borderRightColor: '#AAA',
        borderBottomColor: '#AAA',
        // border: 1px outset #FFF,
        // padding: 0px 0px,
        // margin: 0px 0px 0px 0px,
        display: 'flex',
    },

    header: {
        paddingLeft: 2,
        paddingRight: 2,
        borderBottomColor: '#BBB',
        borderBottomWidth: 1,
        // font-size: smaller,
        // border-bottom: 1px solid #BBB,
        // margin-bottom: 1px,
        // padding: 0 3px 1px 3px,
        // height: 1em,
    },

    container: {
        flexDirection:'row',
        flexWrap:'wrap',
        // display: flex,
        // min-height: 1.4em,
    }

});
