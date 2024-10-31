import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {actions, RichEditor, RichToolbar} from "react-native-pell-rich-editor";
import { theme } from '@/constants/theme';

const RichTextEditor = ({editorRef, onChange} : {editorRef: any, onChange : any}) => {
  return (
    <View style={{minHeight: 285}}>
        <RichToolbar

          actions={[
            actions.insertImage,
            actions.setBold,
            actions.setItalic,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.insertLink,
            actions.keyboard,
            actions.setStrikethrough,
            actions.setUnderline,
            actions.removeFormat,
            actions.insertVideo,
            actions.checkboxList,
            actions.undo,
            actions.redo,
            actions.heading1,
            actions.heading4,
          ]} // default defaultActions

          iconMap={{
            [actions.heading1] : ({tintColor} : {tintColor: any}) => <Text style={{color: tintColor}}>H1</Text>,
            [actions.heading4] : ({tintColor} : {tintColor: any}) => <Text style={{color: tintColor}}>H4</Text>
          }}

          style={styles.richBar}
          flatContainerStyle={styles.flatStyle}
          selectedIconTint={theme.colors.primaryDark}
          editor={editorRef}
          disabled={false}
        />

        <RichEditor
            ref={editorRef}
            containerStyle={styles.rich}
            editorStyle={styles.contentStyle}
            placeholder="What's on your mind"
            onChange={onChange}
        />

    </View>
  )
}

export default RichTextEditor

const styles = StyleSheet.create({
    richBar:{
        borderTopRightRadius: theme.radius.xl,
        borderTopLeftRadius: theme.radius.xl,
        backgroundColor: theme.colors.gray
    },
    flatStyle: {
        paddingHorizontal: 8,
        gap: 3,      
    },
    rich: {
        minHeight: 240,
        flex: 1,
        borderTopWidth: 0,
        borderWidth: 1.5,
        borderBottomLeftRadius: theme.radius.xl,
        borderBottomRightRadius: theme.radius.xl,
        borderColor: theme.colors.gray,
        padding: 5,
    },
    contentStyle: {
        color: theme.colors.textDark,
        placeholderColor: 'gray',
    }
})